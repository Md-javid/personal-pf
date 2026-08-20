import os
import glob
import json
from google_auth_oauthlib.flow import InstalledAppFlow
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

SCOPES = [
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/calendar'
]

def find_client_secret():
    files = glob.glob('client_secret*.json')
    if files:
        return files[0]
    return None

def main():
    secret_file = find_client_secret()
    if not secret_file:
        print("ERROR: No client_secret*.json found.")
        return

    print(f"Using client secrets file: {secret_file}")
    flow = InstalledAppFlow.from_client_secrets_file(
        secret_file,
        scopes=SCOPES,
        redirect_uri='http://localhost:8080/'
    )
    
    print("Starting local listener on http://localhost:8080/ to complete authorization...")
    try:
        creds = flow.run_local_server(port=8080, access_type='offline', prompt='consent')
        with open('token.json', 'w') as token_file:
            token_file.write(creds.to_json())
        print("\nSUCCESS: Saved token.json successfully!")
    except Exception as e:
        print(f"Error during authorization: {e}")

if __name__ == '__main__':
    main()
