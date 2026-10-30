import profileData from './portfolio.json';
import fileTree from './filesystem.json';
import type { PortfolioData } from '../types/portfolio';
import type { DirectoryNode } from '../types/filesystem';

// JSON importé et typé : modifier les données sans toucher aux composants.
export const portfolio: PortfolioData = profileData;
export const root: DirectoryNode = fileTree as DirectoryNode;
