#!/usr/bin/env python3
"""
Smoke test — proves the site and backend actually work, end to end.

    python _tools/smoke_test.py

Boots server.py on a free port against a throwaway data directory, exercises
the public surface, prints a pass/fail table, and shuts down. Nothing touches
your real data/ folder. Exit code is non-zero if anything fails, so it drops
straight into CI.
"""
from __future__ import annotations

import json
import os
import socket
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PASS, FAIL = "\033[32mPASS\033[0m", "\033[31mFAIL\033[0m"
results: list[tuple[bool, str, str]] = []


def check(name: str, ok: bool, detail: str = "") -> None:
    results.append((ok, name, detail))


def free_port() -> int:
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def request(base: str, path: str, method: str = "GET", body: dict | None = None,
            headers: dict | None = None):
    data = json.dumps(body).encode() if body is not None else None
    hdrs = {"Accept": "application/json"}
    if data:
        hdrs["Content-Type"] = "application/json"
    hdrs.update(headers or {})
    req = urllib.request.Request(base + path, data=data, headers=hdrs, method=method)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            raw = resp.read()
            return resp.status, dict(resp.headers), raw
    except urllib.error.HTTPError as exc:
        return exc.code, dict(exc.headers), exc.read()


def main() -> int:
    port = free_port()
    base = f"http://127.0.0.1:{port}"
    tmp = tempfile.mkdtemp(prefix="ab-smoke-")
    env = dict(os.environ)
    env["AB_DATA_DIR"] = tmp
    env.pop("AB_LLM_KEY", None)          # exercise the knowledge-base path
    env.pop("AB_LEAD_WEBHOOK", None)
    env.pop("AB_SMTP_HOST", None)

    proc = subprocess.Popen(
        [sys.executable, str(ROOT / "server.py"), "--port", str(port)],
        cwd=str(ROOT), env=env,
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )

    try:
        for _ in range(60):
            try:
                with socket.create_connection(("127.0.0.1", port), timeout=0.4):
                    break
            except OSError:
                time.sleep(0.1)
        else:
            print("server never came up")
            return 1

        token = (Path(tmp) / ".token").read_text(encoding="utf-8").strip()
        auth = {"X-Admin-Token": token}

        # ---- pages ----
        for page in ["index.html", "cases.html", "services.html", "pricing.html",
                     "contact.html", "privacy.html", "admin.html", "404.html",
                     "case-restaurant.html", "case-salon.html", "case-hardware.html",
                     "case-sports.html", "case-golf.html"]:
            status, _, _ = request(base, "/" + page)
            check(f"GET /{page}", status == 200, f"status {status}")

        status, headers, _ = request(base, "/index.html")
        check("CSP header present", "Content-Security-Policy" in headers)
        check("nosniff header", headers.get("X-Content-Type-Options") == "nosniff")
        check("frame options", headers.get("X-Frame-Options") == "SAMEORIGIN")

        # ---- compression ----
        status, headers, raw = request(base, "/assets/css/site.css", headers={"Accept-Encoding": "gzip"})
        check("css gzipped", headers.get("Content-Encoding") == "gzip" and len(raw) < 20000,
              f"{len(raw)} bytes")
        status, headers, _ = request(base, "/assets/img/cases/golf.webp", headers={"Accept-Encoding": "gzip"})
        check("webp not gzipped", headers.get("Content-Encoding") is None)

        # ---- 404 ----
        status, _, raw = request(base, "/does-not-exist")
        check("404 status", status == 404, f"status {status}")
        check("404 page served", b"Page not found" in raw)

        # ---- health ----
        status, _, raw = request(base, "/api/health")
        health = json.loads(raw)
        check("health ok", status == 200 and health.get("ok") is True)
        check("chat reports kb mode", health.get("chat") == "kb", health.get("chat"))

        # ---- leads ----
        payload = {
            "business": "Smoke Test Cafe", "industry": "restaurant", "name": "Test Person",
            "email": "test@example.com", "phone": "0412 345 678",
            "brief": "Automated smoke test submission.", "plan": "pro",
            "source": "contact", "estimate": "6-10 pages",
        }
        status, _, raw = request(base, "/api/leads", "POST", payload)
        lead_id = json.loads(raw).get("id") if status == 201 else None
        check("POST lead 201", status == 201 and bool(lead_id), f"status {status}")

        status, _, raw = request(base, "/api/leads", "POST",
                                 {"business": "Bot", "name": "x", "email": "a@b.com",
                                  "company_website": "http://spam"})
        check("honeypot silently dropped", status == 202 and json.loads(raw).get("id") is None)

        status, _, raw = request(base, "/api/leads", "POST", {"business": "No Contact"})
        check("invalid lead rejected", status == 422, f"status {status}")

        status, _, _ = request(base, "/api/leads")
        check("list needs a token", status == 401, f"status {status}")

        status, _, raw = request(base, "/api/leads", headers=auth)
        leads = json.loads(raw).get("leads", [])
        check("authed list returns the lead", status == 200 and len(leads) == 1, f"{len(leads)} rows")
        check("lead fields round-trip", leads and leads[0]["business"] == "Smoke Test Cafe")

        status, _, raw = request(base, f"/api/leads/{lead_id}", "PATCH",
                                 {"status": "quoted", "notes": "smoke"}, auth)
        check("PATCH status", status == 200 and json.loads(raw)["lead"]["status"] == "quoted")

        status, _, _ = request(base, f"/api/leads/{lead_id}", "PATCH", {"status": "bogus"}, auth)
        check("PATCH rejects bad status", status == 422, f"status {status}")

        status, headers, raw = request(base, f"/api/leads.csv?token={token}")
        check("CSV export", status == 200 and b"Smoke Test Cafe" in raw)

        status, _, _ = request(base, "/data/.token")
        check("/data/ is blocked", status == 403, f"status {status}")

        # ---- chat ----
        status, _, raw = request(base, "/api/chat", "POST",
                                 {"messages": [{"role": "user", "content": "how much"}]})
        body = json.loads(raw)
        check("chat degrades without a model", status == 200 and body.get("available") is False,
              body.get("reason"))

        # ---- rate limiting (must be last: it poisons this IP) ----
        codes = [request(base, "/api/leads", "POST",
                         {"business": f"RL {i}", "name": "T", "email": f"t{i}@example.com"})[0]
                 for i in range(8)]
        check("lead rate limit kicks in", 429 in codes, f"{codes}")

    finally:
        proc.terminate()
        try:
            proc.wait(timeout=5)
        except subprocess.TimeoutExpired:
            proc.kill()

    width = max(len(n) for _, n, _ in results) + 2
    print()
    for ok, name, detail in results:
        mark = PASS if ok else FAIL
        print(f"  {mark}  {name.ljust(width)} {detail}")
    failed = [r for r in results if not r[0]]
    print()
    print(f"  {len(results) - len(failed)}/{len(results)} passed")
    print()
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
