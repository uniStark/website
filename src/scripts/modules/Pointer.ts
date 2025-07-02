/** @format */

import * as THREE from 'three';
import Common from './Common';

class Pointer {
    pointerMoved: boolean;
    coords: THREE.Vector2;
    private prevCoords: THREE.Vector2;
    diff: THREE.Vector2;
    private timer: ReturnType<typeof setTimeout> | null;

    constructor() {
        this.pointerMoved = false;
        this.coords = new THREE.Vector2();
        this.prevCoords = new THREE.Vector2();
        this.diff = new THREE.Vector2();
        this.timer = null;  // Now valid since type includes null

        this.onPointerMove = this.onPointerMove.bind(this);
        this.onPointerDown = this.onPointerDown.bind(this);
    }

    init() {
        document.body.addEventListener('pointermove', this.onPointerMove, false);
        document.body.addEventListener('pointerdown', this.onPointerDown, false);
    }

    setCoords(x: number, y: number) {
        if (this.timer) clearTimeout(this.timer);

        const coordsX = (x / Common.width) * 2 - 1;
        const coordsY = -(y / Common.height) * 2 + 1;
        this.coords.set(coordsX, coordsY);

        this.pointerMoved = true;

        this.timer = setTimeout(() => {  // Now valid since type matches
            this.pointerMoved = false;
        }, 100);
    }

    onPointerMove(e: PointerEvent) {
        if (e.pointerType == 'touch' && e.isPrimary) {
            this.setCoords(e.pageX, e.pageY);
        } else {
            this.setCoords(e.clientX, e.clientY);
        }
    }

    onPointerDown(e: PointerEvent) {
        if (e.pointerType !== 'touch' || !e.isPrimary) return;

        this.setCoords(e.pageX, e.pageY);
    }

    update() {
        this.diff.subVectors(this.coords, this.prevCoords);
        this.prevCoords.copy(this.coords);
    }
}

export default new Pointer();
