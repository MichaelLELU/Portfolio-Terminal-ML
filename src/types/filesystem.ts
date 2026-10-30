/** Les dossiers sont définis dans filesystem.json, le contenu des fichiers provient de portfolio.json. */
export interface DirectoryNode {
  type: 'directory';
  name: string;
  children: FileSystemNode[];
}

export interface FileNode {
  type: 'file';
  name: string;
  source: string;
}

export type FileSystemNode = DirectoryNode | FileNode;
