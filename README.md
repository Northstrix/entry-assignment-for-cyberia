# Entry Assignment For Cyberia
As the name says

## Highlights
 - English, Hebrew, and Russian localizations

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

    - Create an account with the `server-owner@whatever.xyz` email and a password of your choice.

9. Done:

    - The web app is now functional.
    - Visitors can submit responses, and the owner can access them.

## Credit

The existence of this project (at least in its current form) wouldn't've been possible without the following:

[Bento Grid](https://ui.aceternity.com/components/bento-grid) by [Aceternity UI](https://ui.aceternity.com/)

[Focus Cards](https://ui.aceternity.com/components/focus-cards) by [Aceternity UI](https://ui.aceternity.com/)

[Text Hover Effect](https://ui.aceternity.com/components/text-hover-effect) by [Aceternity UI](https://ui.aceternity.com/)

[Chronicle Button](https://codepen.io/Haaguitos/pen/OJrVZdJ) by [Haaguitos](https://codepen.io/Haaguitos)

[Input Floating Label animation](https://codepen.io/Mahe76/pen/qBQgXyK) by [Elpeeda](https://codepen.io/Mahe76)

[hash-wasm](https://github.com/Daninet/hash-wasm) by [Daninet](https://github.com/Daninet)

[mipher](https://github.com/mpaland/mipher) by [mpaland](https://github.com/mpaland)

[crystals-kyber-js](https://github.com/dajiaji/crystals-kyber-js) by [dajiaji](https://github.com/dajiaji)

[firebase-js-sdk](https://github.com/firebase/firebase-js-sdk) by [firebase](https://github.com/firebase/firebase-js-sdk)

[Daily UI#011 | Flash Message (Error/Success)](https://codepen.io/juliepark/pen/vjMOKQ) by [Julie Park](https://codepen.io/juliepark)

[すりガラスなプロフィールカード](https://codepen.io/ash_creator/pen/zYaPZLB) by [あしざわ - Webクリエイター](https://codepen.io/ash_creator)

[チェックしないと押せないボタン](https://codepen.io/ash_creator/pen/JjZReNm) by [あしざわ - Webクリエイター](https://codepen.io/ash_creator)

[Perplexity](https://www.perplexity.ai/)

Used [Namer UI](https://namer-ui.netlify.app/) component: Fancy Notification
