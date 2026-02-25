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
        this.lastActiveMap.set(leaf, Date.now());
    }

    checkInactiveTabs() {
        const fiveMinutes = 5 * 60 * 1000;
        const now = Date.now();

        this.app.workspace.iterateAllLeaves((leaf) => {
            const lastActive = this.lastActiveMap.get(leaf);

            const viewState = leaf.getViewState();
            if (viewState.pinned || viewState.active) {
                this.updateTimestamp(leaf);
                return
            };

            if (lastActive && (now - lastActive > fiveMinutes)) {
                leaf.detach();
                this.lastActiveMap.delete(leaf);
            }
        });
    }
}
