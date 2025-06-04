import { Module } from '@nestjs/common';

import * as admin from 'firebase-admin';

import { FirestoreService } from './firestore.service';

@Module({
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: async () => {
        const serviceAccount = require('../../firebase-admin.json');
        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
          });
        }
        return admin.firestore();
      },
    },
    FirestoreService,
  ],
  exports: ['FIREBASE_ADMIN', FirestoreService],
})
export class FirestoreModule {}
