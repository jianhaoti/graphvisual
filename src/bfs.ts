interface BfsStep {
  visited: string[];
  queue: string[];
  visiting?: string;
}

export function bfs(
  graph: Record<string, string[]>,
  source: string
): BfsStep[] {
  let visited = new Set<string>([source]);
  let queue = [source];
  let steps: BfsStep[] = [{ visited: Array.from(visited), queue: [...queue] }]; // Initial state

  while (queue.length > 0) {
    let node = queue.shift()!;
    let neighbors = graph[node] || [];
    for (let neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
    steps.push({
      visiting: node,
      visited: Array.from(visited),
      queue: [...queue],
    }); // Capture step state
  }

  return steps;
}
