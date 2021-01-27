import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://inventory-aac80.firebaseio.com'
  });
  admin.firestore().settings({ ignoreUndefinedProperties: true })
}

export default admin.firestore();