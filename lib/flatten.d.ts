import { DocumentNode } from 'graphql/language/ast';
import { DocumentDirectory } from './ast';
export interface DocumentFlatMap {
    [docPath: string]: DocumentNode;
}
export declare function flattenDirectoryStructure(dir: DocumentDirectory, flatMap?: DocumentFlatMap, cwd?: string[]): DocumentFlatMap;
