import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { Firestore } from 'firebase-admin/firestore';

@Injectable()
export class FirestoreService {
  private readonly logger = new Logger(FirestoreService.name);

  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firestore: Firestore,
  ) {}

  async addDocument(collectionPath: string, data: any) {
    const docRef = this.firestore.collection(collectionPath).doc();
    await docRef.set(data);
    this.logger.log(`Document ${docRef.id} added successfully.`);
    return docRef.id;
  }

  async getDocument(collectionPath: string, id: string) {
    const doc = await this.firestore.collection(collectionPath).doc(id).get();
    if (!doc.exists) {
      this.logger.error(`Document ${id} does not exist.`);
      throw new NotFoundException(`Document ${id} does not exist.`);
    }
    return doc.data();
  }

  async getDocumentByCriteria(
    collectionPath: string,
    criteria: string,
    value: any,
  ): Promise<any> {
    const querySnapshot = await this.firestore
      .collection(collectionPath)
      .where(criteria, '==', value)
      .get();
    if (querySnapshot.empty) {
      this.logger.error(
        `No document found with criteria ${criteria} with value ${value}.`,
      );
      return null;
    }
    return querySnapshot.docs[0].data();
  }

  async updateDocument(collectionPath: string, id: string, data: any) {
    await this.firestore.collection(collectionPath).doc(id).update(data);
  }

  async deleteDocument(collectionPath: string, id: string) {
    await this.firestore.collection(collectionPath).doc(id).delete();
  }

  async getAllDocuments(collectionPath: string) {
    const querySnapshot = await this.firestore.collection(collectionPath).get();
    return querySnapshot.docs.map((doc) => doc.data());
  }
}
