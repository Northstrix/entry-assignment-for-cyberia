# Entry Assignment For Cyberia
As the name says

## Highlights
 - Localization support for English, Hebrew, and Russian

 - Responsive navbar optimized for desktop and mobile

 - Breadcrumbs with adjustable spacing between page name and separator (5px desktop, 4px mobile)

 - Background with subtle noise and slight center lightening

 - Right-to-left (RTL) layout support

 - Bento-style image grid using Aceternity’s Focus Card component

 - Dedicated image container for mobile view

 - Pinia store managing current language and active category; preserves filters and language selection across navigation and reloads; sets layout direction (LTR/RTL) based on language

 - SVG-based inputs and checkboxes for desktop

 - Floating label inputs re-render on window resize (desktop)

 - Typography adjustments with customized letter-spacing on inscriptions

 - Secure response collection using ML-KEM-1024, ChaCha20, Serpent-256 CBC, HMAC-SHA512, integrated with Firebase

 - Code formatting using ESLint

## How to run

I assume you already have Node.js and npm installed.


1. Clone the repository using the command:

    ```
    git clone https://github.com/Northstrix/entry-assignment-for-cyberia
    ```

2. Open the project:

    - Open the cloned folder in VS Code or any IDE of your choice.

3. Configure Firebase:

    - Open `plugins/firebase.client.ts`.
    - Create a Firebase instance with Authentication and Firestore Database enabled.
    - Create a new web app in the Firebase instance.
    - Replace the mock credentials in `firebase.client.ts` with your actual Firebase credentials and save the file.

4. Set Firestore rules:

    - Apply the following rules to your Firestore database:

      ```
      rules_version = '2';
      service cloud.firestore {
        match /databases/{database}/documents {
      
          // Anyone can create, only owner can read or delete
          match /data/{userEmail}/receivedResponses/{document=**} {
            allow create: if true;
            allow read, delete: if request.auth != null && request.auth.token.email == userEmail;
          }
      
          // Public folder: anyone can read, only owner can write or delete
          match /data/{userEmail}/public/{document=**} {
            allow read: if true;
            allow write, delete: if request.auth != null && request.auth.token.email == userEmail;
          }
      
          // Private folder: only owner can read, write, or delete
          match /data/{userEmail}/private/{document=**} {
            allow read, write, delete: if request.auth != null && request.auth.token.email == userEmail;
          }
      
          // Default deny
          match /{document=**} {
            allow read, write, delete: if false;
          }
        }
      }
      ```

5. Install dependencies by running:

    ```
    npm install
    ```

6. Start the development server with:

    ```
    npm run dev -- --host 0.0.0.0
    ```

7. Access the dashboard:

    - Open the `/owner-dashboard` route.

8. Create owner account:

    - Create an account with the email `server-owner@whatever.xyz` and a password of your choice.

9. Done:

    - The web app is now functional.
    - Visitors can submit responses, and the owner can access them.
