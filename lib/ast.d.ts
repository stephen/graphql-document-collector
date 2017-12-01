import { DocumentNode, NameNode } from 'graphql/language/ast';
export interface DocumentDirectory {
    kind: 'DocumentDirectory';
    name: NameNode;
    documents: DocumentNode[];
    directories: DocumentDirectory[];
}
