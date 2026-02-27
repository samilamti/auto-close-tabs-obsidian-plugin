import { Plugin, WorkspaceLeaf } from 'obsidian';

export default class AutoCloseTabsPlugin extends Plugin {
    lastActiveMap: Map<WorkspaceLeaf, number> = new Map();

    async onload() {
        const updateTimestamps = (leaf: WorkspaceLeaf | null) => {
            if (!leaf || leaf.getViewState().pinned) return;
            this.updateTimestamp(leaf);
        };

        this.registerEvent(
            this.app.workspace.on('active-leaf-change', updateTimestamps)
        );
        this.app.workspace.iterateAllLeaves(updateTimestamps);

        this.registerInterval(
            window.setInterval(() => this.checkInactiveTabs(), 60 * 1000)
        );
    }

    updateTimestamp(leaf: WorkspaceLeaf) {
        const now = Date.now();
        //console.log(`Updating timestamp on ${leaf.getDisplayText()}: ${now})`);
        this.lastActiveMap.set(leaf, now);
    }

    keepOpen(type: string) {
        switch (type) {
            case 'search':
            case 'empty':
            case 'file-explorer':
            case 'bookmarks':
            case 'backlink':
            case 'tag':
            case 'outline':
                return true;
            default:
                return false;
        }
    }

    checkInactiveTabs() {
        const fiveMinutes = 5 * 60 * 1000;
        const now = Date.now();

        this.app.workspace.iterateAllLeaves((leaf) => {
            const viewState = leaf.getViewState();
            const type = viewState.type;

            //console.log(`Checking leaf: ${leaf.getDisplayText()} (type: ${type})`);

            if (viewState.pinned || viewState.active) {
                this.updateTimestamp(leaf);
                return
            };

            if (this.keepOpen(type)) {
                return;
            }

            const lastActive = this.lastActiveMap.get(leaf);
            if (lastActive && (now - lastActive > fiveMinutes)) {
                leaf.detach();
                this.lastActiveMap.delete(leaf);
            }
        });
    }
}
