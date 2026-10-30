@echo off
REM Starts the local backend: serves the site and stores enquiries.
REM Needs Python 3.8+ on PATH.
cd /d "%~dp0"
python server.py %*
