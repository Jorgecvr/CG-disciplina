import * as THREE from 'three';

// Função para atualizar a posição do tanque adversário.
export function UpdateTankPosition(player, tank) {
    let waypoints = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(32, 0, 0), new THREE.Vector3(0, 0, 32), new THREE.Vector3(32, 0, 32)];
    let currentWaypointIndex = 0;
    const waiypointTolarecance = 0.5;

    let target = waypoints[currentWaypointIndex];
    let direction = new THREE.Vector3().subVectors(target, tank.position).normalize();
    let distance = tank.position.distanceTo(target);

    if(distance < waiypointTolarecance) {
        currentWaypointIndex = (currentWaypointIndex + 1) % waypoints.length;
        target = waypoints[currentWaypointIndex];
    }

    tank.position.add(direction.multiplyScalar(0.25));
    tank.lookAt(target);
};
