import {
  Document,
  Name,
} from 'graphql';

export interface DocumentDirectory {
  kind: 'DocumentDirectory';
  name: Name,
  documents: Document[];
  directories: DocumentDirectory[];
};
