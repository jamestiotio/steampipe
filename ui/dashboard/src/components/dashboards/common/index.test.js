import "../../../test/matchMedia";
import {
  adjustMinValue,
  adjustMaxValue,
  buildNodesAndEdges,
  foldNodesAndEdges,
  themeColors,
} from "./index";
import { Graph } from "graphlib";

describe("common.adjustMinValue", () => {
  test("5", () => {
    expect(adjustMinValue(5)).toEqual(0);
  });

  test("-8", () => {
    expect(adjustMinValue(-8)).toEqual(-9);
  });

  test("-13", () => {
    expect(adjustMinValue(-13)).toEqual(-14);
  });

  test("-20", () => {
    expect(adjustMinValue(-20)).toEqual(-25);
  });

  test("-26", () => {
    expect(adjustMinValue(-26)).toEqual(-30);
  });

  test("-35", () => {
    expect(adjustMinValue(-35)).toEqual(-40);
  });

  test("-50", () => {
    expect(adjustMinValue(-50)).toEqual(-60);
  });

  test("-52", () => {
    expect(adjustMinValue(-52)).toEqual(-60);
  });

  test("-180", () => {
    expect(adjustMinValue(-180)).toEqual(-190);
  });

  test("-210", () => {
    expect(adjustMinValue(-200)).toEqual(-250);
  });

  test("-250", () => {
    expect(adjustMinValue(-250)).toEqual(-300);
  });

  test("-362", () => {
    expect(adjustMinValue(-362)).toEqual(-400);
  });

  test("-1000", () => {
    expect(adjustMinValue(-1000)).toEqual(-1100);
  });

  test("-2363", () => {
    expect(adjustMinValue(-2363)).toEqual(-2400);
  });

  test("-7001", () => {
    expect(adjustMinValue(-7001)).toEqual(-7100);
  });

  test("-10000", () => {
    expect(adjustMinValue(-10000)).toEqual(-11000);
  });

  test("-26526", () => {
    expect(adjustMinValue(-26526)).toEqual(-27000);
  });
});

describe("common.adjustMaxValue", () => {
  test("-5", () => {
    expect(adjustMaxValue(-5)).toEqual(0);
  });

  test("8", () => {
    expect(adjustMaxValue(8)).toEqual(9);
  });

  test("13", () => {
    expect(adjustMaxValue(13)).toEqual(14);
  });

  test("20", () => {
    expect(adjustMaxValue(20)).toEqual(25);
  });

  test("26", () => {
    expect(adjustMaxValue(26)).toEqual(30);
  });

  test("35", () => {
    expect(adjustMaxValue(35)).toEqual(40);
  });

  test("50", () => {
    expect(adjustMaxValue(50)).toEqual(60);
  });

  test("52", () => {
    expect(adjustMaxValue(52)).toEqual(60);
  });

  test("180", () => {
    expect(adjustMaxValue(180)).toEqual(190);
  });

  test("210", () => {
    expect(adjustMaxValue(210)).toEqual(250);
  });

  test("250", () => {
    expect(adjustMaxValue(250)).toEqual(300);
  });

  test("362", () => {
    expect(adjustMaxValue(362)).toEqual(400);
  });

  test("1000", () => {
    expect(adjustMaxValue(1000)).toEqual(1100);
  });

  test("2363", () => {
    expect(adjustMaxValue(2363)).toEqual(2400);
  });

  test("7001", () => {
    expect(adjustMaxValue(7001)).toEqual(7100);
  });

  test("10000", () => {
    expect(adjustMaxValue(10000)).toEqual(11000);
  });

  test("26526", () => {
    expect(adjustMaxValue(26526)).toEqual(27000);
  });
});

describe("common.buildNodesAndEdges", () => {
  test("single node", () => {
    const rawData = {
      columns: [{ name: "id", data_type: "text" }],
      rows: [{ id: "node" }],
    };
    const node = {
      id: "node",
      title: null,
      category: null,
      depth: null,
      row_data: { id: "node" },
      href: null,
      symbol: null,
      isFolded: false,
    };
    const nodesAndEdges = buildNodesAndEdges(rawData);
    delete nodesAndEdges.graph;
    expect(nodesAndEdges).toEqual({
      categories: {},
      edgeMap: {},
      edges: [],
      metadata: { contains_duplicate_edges: false, has_multiple_roots: false },
      next_color_index: 0,
      nodeCategoryMap: {},
      nodeMap: { [node.id]: node },
      nodes: [node],
      root_nodes: {
        node,
      },
    });
  });

  test("single node with category", () => {
    const rawData = {
      columns: [
        { name: "id", data_type: "text" },
        { name: "category", data_type: "text" },
      ],
      rows: [{ id: "node", category: "c1" }],
    };
    const node = {
      id: "node",
      title: null,
      category: "c1",
      depth: null,
      row_data: rawData.rows[0],
      href: null,
      symbol: null,
      isFolded: false,
    };
    const nodesAndEdges = buildNodesAndEdges(rawData);
    delete nodesAndEdges.graph;
    expect(nodesAndEdges).toEqual({
      categories: {
        c1: {
          color: themeColors[0],
          depth: null,
          fields: null,
          fold: null,
          href: null,
          icon: null,
        },
      },
      edgeMap: {},
      edges: [],
      metadata: { contains_duplicate_edges: false, has_multiple_roots: false },
      next_color_index: 1,
      nodeCategoryMap: { c1: { [node.id]: node } },
      nodeMap: { [node.id]: node },
      nodes: [node],
      root_nodes: {
        node,
      },
    });
  });

  test("single node with from_id", () => {
    const rawData = {
      columns: [
        { name: "id", data_type: "text" },
        { name: "from_id", data_type: "text" },
      ],
      rows: [{ id: "node", from_id: "from_node" }],
    };
    const nodesAndEdges = buildNodesAndEdges(rawData);
    delete nodesAndEdges.graph;
    const sourceNode = {
      id: "from_node",
      title: null,
      category: null,
      depth: null,
      row_data: null,
      href: null,
      symbol: null,
      isFolded: false,
    };
    const targetNode = {
      id: "node",
      title: null,
      category: null,
      depth: null,
      row_data: { id: "node", from_id: "from_node" },
      href: null,
      symbol: null,
      isFolded: false,
    };
    const edge = {
      id: "from_node_node",
      from_id: "from_node",
      to_id: "node",
      title: null,
      category: null,
      row_data: null,
    };
    expect(nodesAndEdges).toEqual({
      categories: {},
      edgeMap: { [edge.id]: edge },
      edges: [edge],
      metadata: { contains_duplicate_edges: false, has_multiple_roots: false },
      next_color_index: 0,
      nodeCategoryMap: {},
      nodeMap: { [targetNode.id]: targetNode, [sourceNode.id]: sourceNode },
      nodes: [targetNode, sourceNode],
      root_nodes: {
        [sourceNode.id]: sourceNode,
      },
    });
  });

  test("single node with to_id", () => {
    const rawData = {
      columns: [
        { name: "id", data_type: "text" },
        { name: "to_id", data_type: "text" },
      ],
      rows: [{ id: "node", to_id: "to_node" }],
    };
    const sourceNode = {
      id: "node",
      title: null,
      category: null,
      depth: null,
      row_data: { id: "node", to_id: "to_node" },
      href: null,
      symbol: null,
      isFolded: false,
    };
    const targetNode = {
      id: "to_node",
      title: null,
      category: null,
      depth: null,
      row_data: null,
      href: null,
      symbol: null,
      isFolded: false,
    };
    const edge = {
      id: "node_to_node",
      from_id: "node",
      to_id: "to_node",
      title: null,
      category: null,
      row_data: null,
    };
    const nodesAndEdges = buildNodesAndEdges(rawData);
    delete nodesAndEdges.graph;
    expect(nodesAndEdges).toEqual({
      categories: {},
      edgeMap: { [edge.id]: edge },
      edges: [edge],
      metadata: { contains_duplicate_edges: false, has_multiple_roots: false },
      next_color_index: 0,
      nodeCategoryMap: {},
      nodeMap: { [sourceNode.id]: sourceNode, [targetNode.id]: targetNode },
      nodes: [sourceNode, targetNode],
      root_nodes: {
        node: sourceNode,
      },
    });
  });

  test("single node with from_id and to_id", () => {
    const rawData = {
      columns: [
        { name: "id", data_type: "text" },
        { name: "from_id", data_type: "text" },
        { name: "to_id", data_type: "text" },
      ],
      rows: [{ id: "node", from_id: "from_node", to_id: "to_node" }],
    };
    const edge = {
      id: "from_node_to_node",
      from_id: "from_node",
      to_id: "to_node",
      title: null,
      category: null,
      row_data: null,
    };
    const node = {
      id: "node",
      title: null,
      category: null,
      depth: null,
      row_data: { id: "node", from_id: "from_node", to_id: "to_node" },
      href: null,
      symbol: null,
      isFolded: false,
    };
    const sourceNode = {
      id: "from_node",
      title: null,
      category: null,
      depth: null,
      row_data: null,
      href: null,
      symbol: null,
      isFolded: false,
    };
    const targetNode = {
      id: "to_node",
      title: null,
      category: null,
      depth: null,
      row_data: null,
      href: null,
      symbol: null,
      isFolded: false,
    };
    const nodesAndEdges = buildNodesAndEdges(rawData);
    delete nodesAndEdges.graph;
    expect(nodesAndEdges).toEqual({
      categories: {},
      edgeMap: { [edge.id]: edge },
      edges: [edge],
      metadata: { contains_duplicate_edges: false, has_multiple_roots: true },
      next_color_index: 0,
      nodeCategoryMap: {},
      nodeMap: {
        [node.id]: node,
        [sourceNode.id]: sourceNode,
        [targetNode.id]: targetNode,
      },
      nodes: [node, sourceNode, targetNode],
      root_nodes: {
        node,
        from_node: sourceNode,
      },
    });
  });

  test("two nodes with separate edge declaration", () => {
    const rawData = {
      columns: [
        { name: "id", data_type: "text" },
        { name: "from_id", data_type: "text" },
        { name: "to_id", data_type: "text" },
      ],
      rows: [
        { id: "from_node" },
        { id: "to_node" },
        { from_id: "from_node", to_id: "to_node" },
      ],
    };
    const edge = {
      id: "from_node_to_node",
      from_id: "from_node",
      to_id: "to_node",
      title: null,
      category: null,
      row_data: { from_id: "from_node", to_id: "to_node" },
    };
    const sourceNode = {
      id: "from_node",
      title: null,
      category: null,
      depth: null,
      row_data: { id: "from_node" },
      href: null,
      symbol: null,
      isFolded: false,
    };
    const targetNode = {
      id: "to_node",
      title: null,
      category: null,
      depth: null,
      row_data: { id: "to_node" },
      href: null,
      symbol: null,
      isFolded: false,
    };
    const nodesAndEdges = buildNodesAndEdges(rawData);
    delete nodesAndEdges.graph;
    expect(nodesAndEdges).toEqual({
      categories: {},
      edgeMap: { [edge.id]: edge },
      edges: [edge],
      metadata: { contains_duplicate_edges: false, has_multiple_roots: false },
      next_color_index: 0,
      nodeCategoryMap: {},
      nodeMap: { [sourceNode.id]: sourceNode, [targetNode.id]: targetNode },
      nodes: [sourceNode, targetNode],
      root_nodes: {
        from_node: sourceNode,
      },
    });
  });

  test("two nodes with separate edge declaration including properties", () => {
    const rawData = {
      columns: [
        { name: "id", data_type: "text" },
        { name: "from_id", data_type: "text" },
        { name: "to_id", data_type: "text" },
        { name: "title", data_type: "text" },
        { name: "properties", data_type: "jsonb" },
      ],
      rows: [
        { id: "from_node", title: "From Node", properties: { foo: "bar" } },
        { id: "to_node", title: "To Node", properties: { bar: "foo" } },
        {
          from_id: "from_node",
          to_id: "to_node",
          title: "The Edge",
          properties: { foobar: "barfoo" },
        },
      ],
    };
    const edge = {
      id: "from_node_to_node",
      from_id: "from_node",
      to_id: "to_node",
      title: "The Edge",
      category: null,
      row_data: {
        from_id: "from_node",
        to_id: "to_node",
        title: "The Edge",
        properties: { foobar: "barfoo" },
      },
    };
    const sourceNode = {
      id: "from_node",
      title: "From Node",
      category: null,
      depth: null,
      row_data: {
        id: "from_node",
        title: "From Node",
        properties: { foo: "bar" },
      },
      href: null,
      symbol: null,
      isFolded: false,
    };
    const targetNode = {
      id: "to_node",
      title: "To Node",
      category: null,
      depth: null,
      row_data: {
        id: "to_node",
        title: "To Node",
        properties: { bar: "foo" },
      },
      href: null,
      symbol: null,
      isFolded: false,
    };
    const nodesAndEdges = buildNodesAndEdges(rawData);
    delete nodesAndEdges.graph;
    expect(nodesAndEdges).toEqual({
      categories: {},
      edgeMap: { [edge.id]: edge },
      edges: [edge],
      metadata: { contains_duplicate_edges: false, has_multiple_roots: false },
      next_color_index: 0,
      nodeCategoryMap: {},
      nodeMap: { [sourceNode.id]: sourceNode, [targetNode.id]: targetNode },
      nodes: [sourceNode, targetNode],
      root_nodes: {
        from_node: sourceNode,
      },
    });
  });

  // test("single node with title", () => {
  //   const rawData = {
  //     columns: [
  //       { name: "id", data_type: "text" },
  //       { name: "title", data_type: "text" },
  //     ],
  //     rows: [{ id: "a_node", title: "A Node Title" }],
  //   };
  //   expect(buildNodesAndEdges(rawData)).toEqual({
  //     categories: {},
  //     edges: [],
  //     metadata: { contains_duplicate_edges: false, has_multiple_roots: false },
  //     next_color_index: 0,
  //     nodes: [
  //       { category: null, depth: null, id: "a_node", title: "A Node Title" },
  //     ],
  //     root_nodes: {
  //       a_node: {
  //         category: null,
  //         depth: null,
  //         id: "a_node",
  //         title: "A Node Title",
  //       },
  //     },
  //   });
  // });
  //
  // test("single node with category", () => {
  //   const rawData = {
  //     columns: [
  //       { name: "id", data_type: "text" },
  //       { name: "category", data_type: "text" },
  //     ],
  //     rows: [{ id: "a_node", category: "a_category" }],
  //   };
  //   expect(buildNodesAndEdges(rawData)).toEqual({
  //     categories: {},
  //     edges: [],
  //     metadata: { contains_duplicate_edges: false, has_multiple_roots: false },
  //     next_color_index: 0,
  //     nodes: [
  //       { category: "a_category", depth: null, id: "a_node", title: null },
  //     ],
  //     root_nodes: {
  //       a_node: {
  //         category: "a_category",
  //         depth: null,
  //         id: "a_node",
  //         title: null,
  //       },
  //     },
  //   });
  // });
});

describe("common.foldNodesAndEdges", () => {
  test("Basic fold", () => {
    const graph = new Graph({ directed: true });
    graph.setNode("c1-1");
    graph.setNode("c2-1");
    graph.setNode("c2-2");
    graph.setNode("c2-3");
    graph.setEdge("c1-1", "c2-1");
    graph.setEdge("c1-1", "c2-2");
    graph.setEdge("c1-1", "c2-3");
    const node_c1_1 = {
      id: "c1-1",
      category: "c1",
    };
    const node_c2_1 = {
      id: "c2-1",
      category: "c2",
    };
    const node_c2_2 = {
      id: "c2-2",
      category: "c2",
    };
    const node_c2_3 = {
      id: "c2-3",
      category: "c2",
    };
    const edge_c1_1_c2_1 = {
      id: "c1-1_c2-1",
      from_id: "c1-1",
      to_id: "c2-1",
    };
    const edge_c1_1_c2_2 = {
      id: "c1-1_c2-2",
      from_id: "c1-1",
      to_id: "c2-2",
    };
    const edge_c1_1_c2_3 = {
      id: "c1-1_c2-3",
      from_id: "c1-1",
      to_id: "c2-3",
    };
    const category_1 = { id: "c1" };
    const category_2 = { id: "c2", fold: { threshold: 2 } };
    const nodesAndEdgesInput = {
      graph,
      nodeCategoryMap: {
        c1: {
          [node_c1_1.id]: node_c1_1,
        },
        c2: {
          [node_c2_1.id]: node_c2_1,
          [node_c2_2.id]: node_c2_2,
          [node_c2_3.id]: node_c2_3,
        },
      },
      nodeMap: {
        [node_c1_1.id]: node_c1_1,
        [node_c2_1.id]: node_c2_1,
        [node_c2_2.id]: node_c2_2,
        [node_c2_3.id]: node_c2_3,
      },
      nodes: [node_c1_1, node_c2_1, node_c2_2, node_c2_3],
      edgeMap: {
        [edge_c1_1_c2_1.id]: edge_c1_1_c2_1,
        [edge_c1_1_c2_2.id]: edge_c1_1_c2_2,
        [edge_c1_1_c2_3.id]: edge_c1_1_c2_3,
      },
      edges: [edge_c1_1_c2_1, edge_c1_1_c2_2, edge_c1_1_c2_3],
      root_nodes: { [node_c1_1.id]: node_c1_1 },
      categories: { [category_1.id]: category_1, [category_2.id]: category_2 },
    };
    const nodesAndEdges = foldNodesAndEdges(nodesAndEdgesInput);
    delete nodesAndEdges.graph;
    const foldedNode = {
      id: "fold-c2-1",
      category: "c2",
      depth: null,
      href: null,
      icon: undefined,
      isFolded: true,
      foldedNodes: [
        { id: node_c2_1.id, title: node_c2_1.title },
        { id: node_c2_2.id, title: node_c2_2.title },
        { id: node_c2_3.id, title: node_c2_3.title },
      ],
      row_data: null,
      symbol: null,
      title: null,
    };
    expect(nodesAndEdges).toEqual({
      nodeCategoryMap: {
        c1: {
          [node_c1_1.id]: node_c1_1,
        },
        c2: {
          [foldedNode.id]: foldedNode,
        },
      },
      nodeMap: {
        [node_c1_1.id]: node_c1_1,
        [foldedNode.id]: foldedNode,
      },
      nodes: [node_c1_1, foldedNode],
      edgeMap: {
        "c1-1_fold-c2-1": {
          id: "c1-1_fold-c2-1",
          from_id: "c1-1",
          to_id: "fold-c2-1",
          category: null,
          title: null,
        },
      },
      edges: [
        {
          id: "c1-1_fold-c2-1",
          from_id: "c1-1",
          to_id: "fold-c2-1",
          category: null,
          title: null,
        },
      ],
      root_nodes: { [node_c1_1.id]: node_c1_1 },
      categories: { [category_1.id]: category_1, [category_2.id]: category_2 },
    });
  });

  test("Middle fold", () => {
    const graph = new Graph({ directed: true });
    graph.setNode("c1-1");
    graph.setNode("c2-1");
    graph.setNode("c2-2");
    graph.setNode("c2-3");
    graph.setNode("c3-1");
    graph.setEdge("c1-1", "c2-1");
    graph.setEdge("c1-1", "c2-2");
    graph.setEdge("c1-1", "c2-3");
    graph.setEdge("c3-1", "c2-1");
    graph.setEdge("c3-1", "c2-2");
    graph.setEdge("c3-1", "c2-3");
    const node_c1_1 = {
      id: "c1-1",
      category: "c1",
    };
    const node_c2_1 = {
      id: "c2-1",
      category: "c2",
    };
    const node_c2_2 = {
      id: "c2-2",
      category: "c2",
    };
    const node_c2_3 = {
      id: "c2-3",
      category: "c2",
    };
    const node_c3_1 = {
      id: "c3-1",
      category: "c3",
    };
    const edge_c1_1_c2_1 = {
      id: "c1-1_c2-1",
      from_id: "c1-1",
      to_id: "c2-1",
    };
    const edge_c1_1_c2_2 = {
      id: "c1-1_c2-2",
      from_id: "c1-1",
      to_id: "c2-2",
    };
    const edge_c1_1_c2_3 = {
      id: "c1-1_c2-3",
      from_id: "c1-1",
      to_id: "c2-3",
    };
    const edge_c3_1_c2_1 = {
      id: "c3-1_c2-1",
      from_id: "c3-1",
      to_id: "c2-1",
    };
    const edge_c3_1_c2_2 = {
      id: "c3-1_c2-2",
      from_id: "c3-1",
      to_id: "c2-2",
    };
    const edge_c3_1_c2_3 = {
      id: "c3-1_c2-3",
      from_id: "c3-1",
      to_id: "c2-3",
    };
    const category_1 = { id: "c1" };
    const category_2 = { id: "c2", fold: { threshold: 2 } };
    const category_3 = { id: "c3" };
    const nodesAndEdgesInput = {
      graph,
      nodeCategoryMap: {
        c1: {
          [node_c1_1.id]: node_c1_1,
        },
        c2: {
          [node_c2_1.id]: node_c2_1,
          [node_c2_2.id]: node_c2_2,
          [node_c2_3.id]: node_c2_3,
        },
        c3: {
          [node_c3_1.id]: node_c3_1,
        },
      },
      nodeMap: {
        [node_c1_1.id]: node_c1_1,
        [node_c2_1.id]: node_c2_1,
        [node_c2_2.id]: node_c2_2,
        [node_c2_3.id]: node_c2_3,
        [node_c3_1.id]: node_c3_1,
      },
      nodes: [node_c1_1, node_c2_1, node_c2_2, node_c2_3, node_c3_1],
      edgeMap: {
        [edge_c1_1_c2_1.id]: edge_c1_1_c2_1,
        [edge_c1_1_c2_2.id]: edge_c1_1_c2_2,
        [edge_c1_1_c2_3.id]: edge_c1_1_c2_3,
        [edge_c3_1_c2_1.id]: edge_c3_1_c2_1,
        [edge_c3_1_c2_2.id]: edge_c3_1_c2_2,
        [edge_c3_1_c2_3.id]: edge_c3_1_c2_3,
      },
      edges: [
        edge_c1_1_c2_1,
        edge_c1_1_c2_2,
        edge_c1_1_c2_3,
        edge_c3_1_c2_1,
        edge_c3_1_c2_2,
        edge_c3_1_c2_3,
      ],
      root_nodes: { [node_c1_1.id]: node_c1_1, [node_c3_1.id]: node_c3_1 },
      categories: {
        [category_1.id]: category_1,
        [category_2.id]: category_2,
        [category_3.id]: category_3,
      },
    };
    const nodesAndEdges = foldNodesAndEdges(nodesAndEdgesInput);
    delete nodesAndEdges.graph;
    const foldedNode = {
      id: "fold-c2-1",
      category: "c2",
      depth: null,
      href: null,
      icon: undefined,
      isFolded: true,
      foldedNodes: [
        { id: node_c2_1.id, title: node_c2_1.title },
        { id: node_c2_2.id, title: node_c2_2.title },
        { id: node_c2_3.id, title: node_c2_3.title },
      ],
      row_data: null,
      symbol: null,
      title: null,
    };
    expect(nodesAndEdges).toEqual({
      nodeCategoryMap: {
        c1: {
          [node_c1_1.id]: node_c1_1,
        },
        c2: {
          [foldedNode.id]: foldedNode,
        },
        c3: {
          [node_c3_1.id]: node_c3_1,
        },
      },
      nodeMap: {
        [node_c1_1.id]: node_c1_1,
        [node_c3_1.id]: node_c3_1,
        [foldedNode.id]: foldedNode,
      },
      nodes: [node_c1_1, node_c3_1, foldedNode],
      edgeMap: {
        "c1-1_fold-c2-1": {
          id: "c1-1_fold-c2-1",
          from_id: "c1-1",
          to_id: "fold-c2-1",
          category: null,
          title: null,
        },
        "c3-1_fold-c2-1": {
          id: "c3-1_fold-c2-1",
          from_id: "c3-1",
          to_id: "fold-c2-1",
          category: null,
          title: null,
        },
      },
      edges: [
        {
          id: "c1-1_fold-c2-1",
          from_id: "c1-1",
          to_id: "fold-c2-1",
          category: null,
          title: null,
        },
        {
          id: "c3-1_fold-c2-1",
          from_id: "c3-1",
          to_id: "fold-c2-1",
          category: null,
          title: null,
        },
      ],
      root_nodes: { [node_c1_1.id]: node_c1_1, [node_c3_1.id]: node_c3_1 },
      categories: {
        [category_1.id]: category_1,
        [category_2.id]: category_2,
        [category_3.id]: category_3,
      },
    });
  });

  test("3-way fold", () => {
    const graph = new Graph({ directed: true });
    graph.setNode("c1-1");
    graph.setNode("c2-1");
    graph.setNode("c2-2");
    graph.setNode("c2-3");
    graph.setNode("c3-1");
    graph.setNode("c4-1");
    graph.setEdge("c1-1", "c2-1");
    graph.setEdge("c1-1", "c2-2");
    graph.setEdge("c1-1", "c2-3");
    graph.setEdge("c3-1", "c2-1");
    graph.setEdge("c3-1", "c2-2");
    graph.setEdge("c3-1", "c2-3");
    graph.setEdge("c4-1", "c2-1");
    graph.setEdge("c4-1", "c2-2");
    graph.setEdge("c4-1", "c2-3");
    const node_c1_1 = {
      id: "c1-1",
      category: "c1",
    };
    const node_c2_1 = {
      id: "c2-1",
      category: "c2",
    };
    const node_c2_2 = {
      id: "c2-2",
      category: "c2",
    };
    const node_c2_3 = {
      id: "c2-3",
      category: "c2",
    };
    const node_c3_1 = {
      id: "c3-1",
      category: "c3",
    };
    const node_c4_1 = {
      id: "c4-1",
      category: "c4",
    };
    const edge_c1_1_c2_1 = {
      id: "c1-1_c2-1",
      from_id: "c1-1",
      to_id: "c2-1",
    };
    const edge_c1_1_c2_2 = {
      id: "c1-1_c2-2",
      from_id: "c1-1",
      to_id: "c2-2",
    };
    const edge_c1_1_c2_3 = {
      id: "c1-1_c2-3",
      from_id: "c1-1",
      to_id: "c2-3",
    };
    const edge_c3_1_c2_1 = {
      id: "c3-1_c2-1",
      from_id: "c3-1",
      to_id: "c2-1",
    };
    const edge_c3_1_c2_2 = {
      id: "c3-1_c2-2",
      from_id: "c3-1",
      to_id: "c2-2",
    };
    const edge_c3_1_c2_3 = {
      id: "c3-1_c2-3",
      from_id: "c3-1",
      to_id: "c2-3",
    };
    const edge_c4_1_c2_1 = {
      id: "c4-1_c2-1",
      from_id: "c4-1",
      to_id: "c2-1",
    };
    const edge_c4_1_c2_2 = {
      id: "c4-1_c2-2",
      from_id: "c4-1",
      to_id: "c2-2",
    };
    const edge_c4_1_c2_3 = {
      id: "c4-1_c2-3",
      from_id: "c4-1",
      to_id: "c2-3",
    };
    const category_1 = { id: "c1" };
    const category_2 = { id: "c2", fold: { threshold: 2 } };
    const category_3 = { id: "c3" };
    const category_4 = { id: "c4" };
    const nodesAndEdgesInput = {
      graph,
      nodeCategoryMap: {
        c1: {
          [node_c1_1.id]: node_c1_1,
        },
        c2: {
          [node_c2_1.id]: node_c2_1,
          [node_c2_2.id]: node_c2_2,
          [node_c2_3.id]: node_c2_3,
        },
        c3: {
          [node_c3_1.id]: node_c3_1,
        },
        c4: {
          [node_c4_1.id]: node_c4_1,
        },
      },
      edgeMap: {
        [edge_c1_1_c2_1.id]: edge_c1_1_c2_1,
        [edge_c1_1_c2_2.id]: edge_c1_1_c2_2,
        [edge_c1_1_c2_3.id]: edge_c1_1_c2_3,
        [edge_c3_1_c2_1.id]: edge_c3_1_c2_1,
        [edge_c3_1_c2_2.id]: edge_c3_1_c2_2,
        [edge_c3_1_c2_3.id]: edge_c3_1_c2_3,
        [edge_c4_1_c2_1.id]: edge_c4_1_c2_1,
        [edge_c4_1_c2_2.id]: edge_c4_1_c2_2,
        [edge_c4_1_c2_3.id]: edge_c4_1_c2_3,
      },
      edges: [
        edge_c1_1_c2_1,
        edge_c1_1_c2_2,
        edge_c1_1_c2_3,
        edge_c3_1_c2_1,
        edge_c3_1_c2_2,
        edge_c3_1_c2_3,
        edge_c4_1_c2_1,
        edge_c4_1_c2_2,
        edge_c4_1_c2_3,
      ],
      nodeMap: {
        [node_c1_1.id]: node_c1_1,
        [node_c2_1.id]: node_c2_1,
        [node_c2_2.id]: node_c2_2,
        [node_c2_3.id]: node_c2_3,
        [node_c3_1.id]: node_c3_1,
        [node_c4_1.id]: node_c4_1,
      },
      nodes: [node_c1_1, node_c2_1, node_c2_2, node_c2_3, node_c3_1, node_c4_1],
      root_nodes: {
        [node_c1_1.id]: node_c1_1,
        [node_c3_1.id]: node_c3_1,
        [node_c4_1.id]: node_c4_1,
      },
      categories: {
        [category_1.id]: category_1,
        [category_2.id]: category_2,
        [category_3.id]: category_3,
        [category_4.id]: category_4,
      },
    };
    const nodesAndEdges = foldNodesAndEdges(nodesAndEdgesInput);
    delete nodesAndEdges.graph;
    const foldedNode = {
      id: "fold-c2-1",
      category: "c2",
      depth: null,
      href: null,
      icon: undefined,
      isFolded: true,
      foldedNodes: [
        { id: node_c2_1.id, title: node_c2_1.title },
        { id: node_c2_2.id, title: node_c2_2.title },
        { id: node_c2_3.id, title: node_c2_3.title },
      ],
      row_data: null,
      symbol: null,
      title: null,
    };
    expect(nodesAndEdges).toEqual({
      nodeCategoryMap: {
        c1: {
          [node_c1_1.id]: node_c1_1,
        },
        c2: {
          [foldedNode.id]: foldedNode,
        },
        c3: {
          [node_c3_1.id]: node_c3_1,
        },
        c4: {
          [node_c4_1.id]: node_c4_1,
        },
      },
      nodeMap: {
        [node_c1_1.id]: node_c1_1,
        [node_c3_1.id]: node_c3_1,
        [node_c4_1.id]: node_c4_1,
        [foldedNode.id]: foldedNode,
      },
      nodes: [node_c1_1, node_c3_1, node_c4_1, foldedNode],
      edgeMap: {
        "c1-1_fold-c2-1": {
          id: "c1-1_fold-c2-1",
          from_id: "c1-1",
          to_id: "fold-c2-1",
          category: null,
          title: null,
        },
        "c3-1_fold-c2-1": {
          id: "c3-1_fold-c2-1",
          from_id: "c3-1",
          to_id: "fold-c2-1",
          category: null,
          title: null,
        },
        "c4-1_fold-c2-1": {
          id: "c4-1_fold-c2-1",
          from_id: "c4-1",
          to_id: "fold-c2-1",
          category: null,
          title: null,
        },
      },
      edges: [
        {
          id: "c1-1_fold-c2-1",
          from_id: "c1-1",
          to_id: "fold-c2-1",
          category: null,
          title: null,
        },
        {
          id: "c3-1_fold-c2-1",
          from_id: "c3-1",
          to_id: "fold-c2-1",
          category: null,
          title: null,
        },
        {
          id: "c4-1_fold-c2-1",
          from_id: "c4-1",
          to_id: "fold-c2-1",
          category: null,
          title: null,
        },
      ],
      root_nodes: {
        [node_c1_1.id]: node_c1_1,
        [node_c3_1.id]: node_c3_1,
        [node_c4_1.id]: node_c4_1,
      },
      categories: {
        [category_1.id]: category_1,
        [category_2.id]: category_2,
        [category_3.id]: category_3,
        [category_4.id]: category_4,
      },
    });
  });

  test("Multiple inheritance", () => {
    const graph = new Graph({ directed: true });
    graph.setNode("c1-1");
    graph.setNode("c2-1");
    graph.setNode("c2-2");
    graph.setNode("c2-3");
    graph.setNode("c3-1");
    graph.setEdge("c1-1", "c2-1");
    graph.setEdge("c1-1", "c2-2");
    graph.setEdge("c1-1", "c2-3");
    graph.setEdge("c3-1", "c2-3");
    const node_c1_1 = {
      id: "c1-1",
      category: "c1",
    };
    const node_c2_1 = {
      id: "c2-1",
      category: "c2",
    };
    const node_c2_2 = {
      id: "c2-2",
      category: "c2",
    };
    const node_c2_3 = {
      id: "c2-3",
      category: "c2",
    };
    const node_c3_1 = {
      id: "c3-1",
      category: "c3",
    };
    const edge_c1_1_c2_1 = {
      id: "c1-1_c2-1",
      from_id: "c1-1",
      to_id: "c2-1",
    };
    const edge_c1_1_c2_2 = {
      id: "c1-1_c2-2",
      from_id: "c1-1",
      to_id: "c2-2",
    };
    const edge_c1_1_c2_3 = {
      id: "c1-1_c2-3",
      from_id: "c1-1",
      to_id: "c2-3",
    };
    const edge_c3_1_c2_3 = {
      id: "c3-1_c2-3",
      from_id: "c3-1",
      to_id: "c2-3",
    };
    const category_1 = {};
    const category_2 = { fold: { threshold: 2 } };
    const category_3 = {};
    const nodesAndEdgesInput = {
      graph,
      edgeMap: {
        [edge_c1_1_c2_1.id]: edge_c1_1_c2_1,
        [edge_c1_1_c2_2.id]: edge_c1_1_c2_2,
        [edge_c1_1_c2_3.id]: edge_c1_1_c2_3,
        [edge_c3_1_c2_3.id]: edge_c3_1_c2_3,
      },
      edges: [edge_c1_1_c2_1, edge_c1_1_c2_2, edge_c1_1_c2_3, edge_c3_1_c2_3],
      nodeCategoryMap: {
        c1: {
          [node_c1_1.id]: node_c1_1,
        },
        c2: {
          [node_c2_1.id]: node_c2_1,
          [node_c2_2.id]: node_c2_2,
          [node_c2_3.id]: node_c2_3,
        },
        c3: {
          [node_c3_1.id]: node_c3_1,
        },
      },
      nodeMap: {
        [node_c1_1.id]: node_c1_1,
        [node_c2_1.id]: node_c2_1,
        [node_c2_2.id]: node_c2_2,
        [node_c2_3.id]: node_c2_3,
        [node_c3_1.id]: node_c3_1,
      },
      nodes: [node_c1_1, node_c2_1, node_c2_2, node_c2_3, node_c3_1],
      root_nodes: { [node_c1_1.id]: node_c1_1, [node_c3_1.id]: node_c3_1 },
      categories: { c1: category_1, c2: category_2, c3: category_3 },
    };
    const nodesAndEdges = foldNodesAndEdges(nodesAndEdgesInput);
    delete nodesAndEdges.graph;
    const foldedNode = {
      id: "fold-c2-1",
      category: "c2",
      depth: null,
      href: null,
      icon: undefined,
      isFolded: true,
      foldedNodes: [
        { id: node_c2_1.id, title: node_c2_1.title },
        { id: node_c2_2.id, title: node_c2_2.title },
      ],
      row_data: null,
      symbol: null,
      title: null,
    };
    expect(nodesAndEdges).toEqual({
      nodeCategoryMap: {
        c1: {
          [node_c1_1.id]: node_c1_1,
        },
        c2: {
          [node_c2_3.id]: node_c2_3,
          [foldedNode.id]: foldedNode,
        },
        c3: {
          [node_c3_1.id]: node_c3_1,
        },
      },
      nodeMap: {
        [node_c1_1.id]: node_c1_1,
        [node_c2_3.id]: node_c2_3,
        [node_c3_1.id]: node_c3_1,
        [foldedNode.id]: foldedNode,
      },
      nodes: [node_c1_1, node_c2_3, node_c3_1, foldedNode],
      edgeMap: {
        [edge_c1_1_c2_3.id]: edge_c1_1_c2_3,
        [edge_c3_1_c2_3.id]: edge_c3_1_c2_3,
        "c1-1_fold-c2-1": {
          id: "c1-1_fold-c2-1",
          from_id: "c1-1",
          to_id: "fold-c2-1",
          category: null,
          title: null,
        },
      },
      edges: [
        edge_c1_1_c2_3,
        edge_c3_1_c2_3,
        {
          id: "c1-1_fold-c2-1",
          from_id: "c1-1",
          to_id: "fold-c2-1",
          category: null,
          title: null,
        },
      ],
      root_nodes: { [node_c1_1.id]: node_c1_1, [node_c3_1.id]: node_c3_1 },
      categories: { c1: category_1, c2: category_2, c3: category_3 },
    });
  });

  test("Edge direction is included in fold group decision, so this does not collapse", () => {
    const graph = new Graph({ directed: true });
    graph.setNode("c1-1");
    graph.setNode("c2-1");
    graph.setNode("c2-2");
    graph.setNode("c3-1");
    graph.setEdge("c1-1", "c2-1");
    graph.setEdge("c1-1", "c2-2");
    graph.setEdge("c3-1", "c2-1");
    graph.setEdge("c2-2", "c3-1");
    const node_c1_1 = {
      id: "c1-1",
      category: "c1",
    };
    const node_c2_1 = {
      id: "c2-1",
      category: "c2",
    };
    const node_c2_2 = {
      id: "c2-2",
      category: "c2",
    };
    const node_c3_1 = {
      id: "c3-1",
      category: "c3",
    };
    const edge_c1_1_c2_1 = {
      id: "c1-1_c2-1",
      from_id: "c1-1",
      to_id: "c2-1",
    };
    const edge_c1_1_c2_2 = {
      id: "c1-1_c2-2",
      from_id: "c1-1",
      to_id: "c2-2",
    };
    const edge_c3_1_c2_1 = {
      id: "c3-1_c2-1",
      from_id: "c3-1",
      to_id: "c2-1",
    };
    const edge_c2_2_c3_1 = {
      id: "c2-2_c3-1",
      from_id: "c2-2",
      to_id: "c3-1",
    };
    const category_1 = { id: "c1" };
    const category_2 = { id: "c2", fold: { threshold: 2 } };
    const category_3 = { id: "c3" };
    const nodesAndEdgesInput = {
      graph,
      nodeCategoryMap: {
        c1: {
          [node_c1_1.id]: node_c1_1,
        },
        c2: {
          [node_c2_1.id]: node_c2_1,
          [node_c2_2.id]: node_c2_2,
        },
        c3: {
          [node_c3_1.id]: node_c3_1,
        },
      },
      nodeMap: {
        [node_c1_1.id]: node_c1_1,
        [node_c2_1.id]: node_c2_1,
        [node_c2_2.id]: node_c2_2,
        [node_c3_1.id]: node_c3_1,
      },
      nodes: [node_c1_1, node_c2_1, node_c2_2, node_c3_1],
      edgeMap: {
        [edge_c1_1_c2_1.id]: edge_c1_1_c2_1,
        [edge_c1_1_c2_2.id]: edge_c1_1_c2_2,
        [edge_c3_1_c2_1.id]: edge_c3_1_c2_1,
        [edge_c2_2_c3_1.id]: edge_c2_2_c3_1,
      },
      edges: [edge_c1_1_c2_1, edge_c1_1_c2_2, edge_c3_1_c2_1, edge_c2_2_c3_1],
      root_nodes: { [node_c1_1.id]: node_c1_1 },
      categories: {
        [category_1.id]: category_1,
        [category_2.id]: category_2,
        [category_3.id]: category_3,
      },
    };
    const nodesAndEdges = foldNodesAndEdges(nodesAndEdgesInput);
    delete nodesAndEdges.graph;
    delete nodesAndEdgesInput.graph;
    expect(nodesAndEdges).toEqual(nodesAndEdgesInput);
  });

  test("All edges are included in fold group decision", () => {
    const graph = new Graph({ directed: true });
    graph.setNode("c1-1");
    graph.setNode("c2-1");
    graph.setNode("c2-2");
    graph.setNode("c2-3");
    graph.setNode("c3-1");
    graph.setNode("c4-1");
    graph.setEdge("c1-1", "c2-1");
    graph.setEdge("c1-1", "c2-2");
    graph.setEdge("c1-1", "c2-3");
    graph.setEdge("c3-1", "c2-1");
    graph.setEdge("c3-1", "c2-2");
    graph.setEdge("c3-1", "c2-3");
    graph.setEdge("c4-1", "c2-3");
    const node_c1_1 = {
      id: "c1-1",
      category: "c1",
    };
    const node_c2_1 = {
      id: "c2-1",
      category: "c2",
    };
    const node_c2_2 = {
      id: "c2-2",
      category: "c2",
    };
    const node_c2_3 = {
      id: "c2-3",
      category: "c2",
    };
    const node_c3_1 = {
      id: "c3-1",
      category: "c3",
    };
    const node_c4_1 = {
      id: "c4-1",
      category: "c4",
    };
    const edge_c1_1_c2_1 = {
      id: "c1-1_c2-1",
      from_id: "c1-1",
      to_id: "c2-1",
    };
    const edge_c1_1_c2_2 = {
      id: "c1-1_c2-2",
      from_id: "c1-1",
      to_id: "c2-2",
    };
    const edge_c1_1_c2_3 = {
      id: "c1-1_c2-3",
      from_id: "c1-1",
      to_id: "c2-3",
    };
    const edge_c3_1_c2_1 = {
      id: "c3-1_c2-1",
      from_id: "c3-1",
      to_id: "c2-1",
    };
    const edge_c3_1_c2_2 = {
      id: "c3-1_c2-2",
      from_id: "c3-1",
      to_id: "c2-2",
    };
    const edge_c3_1_c2_3 = {
      id: "c3-1_c2-3",
      from_id: "c3-1",
      to_id: "c2-3",
    };
    const edge_c4_1_c2_3 = {
      id: "c4-1_c2-3",
      from_id: "c4-1",
      to_id: "c2-3",
    };
    const category_1 = { id: "c1" };
    const category_2 = { id: "c2", fold: { threshold: 2 } };
    const category_3 = { id: "c3" };
    const category_4 = { id: "c4" };
    const nodesAndEdgesInput = {
      graph,
      nodeCategoryMap: {
        c1: {
          [node_c1_1.id]: node_c1_1,
        },
        c2: {
          [node_c2_1.id]: node_c2_1,
          [node_c2_2.id]: node_c2_2,
          [node_c2_3.id]: node_c2_3,
        },
        c3: {
          [node_c3_1.id]: node_c3_1,
        },
        c4: {
          [node_c4_1.id]: node_c4_1,
        },
      },
      nodeMap: {
        [node_c1_1.id]: node_c1_1,
        [node_c2_1.id]: node_c2_1,
        [node_c2_2.id]: node_c2_2,
        [node_c2_3.id]: node_c2_3,
        [node_c3_1.id]: node_c3_1,
        [node_c4_1.id]: node_c4_1,
      },
      nodes: [node_c1_1, node_c2_1, node_c2_2, node_c2_3, node_c3_1, node_c4_1],
      edgeMap: {
        [edge_c1_1_c2_1.id]: edge_c1_1_c2_1,
        [edge_c1_1_c2_2.id]: edge_c1_1_c2_2,
        [edge_c1_1_c2_3.id]: edge_c1_1_c2_3,
        [edge_c3_1_c2_1.id]: edge_c3_1_c2_1,
        [edge_c3_1_c2_2.id]: edge_c3_1_c2_2,
        [edge_c3_1_c2_3.id]: edge_c3_1_c2_3,
        [edge_c4_1_c2_3.id]: edge_c4_1_c2_3,
      },
      edges: [
        edge_c1_1_c2_1,
        edge_c1_1_c2_2,
        edge_c1_1_c2_3,
        edge_c3_1_c2_1,
        edge_c3_1_c2_2,
        edge_c3_1_c2_3,
        edge_c4_1_c2_3,
      ],
      root_nodes: {
        [node_c1_1.id]: node_c1_1,
        [node_c3_1.id]: node_c3_1,
        [node_c4_1.id]: node_c4_1,
      },
      categories: {
        [category_1.id]: category_1,
        [category_2.id]: category_2,
        [category_3.id]: category_3,
        [category_4.id]: category_4,
      },
    };
    const nodesAndEdges = foldNodesAndEdges(nodesAndEdgesInput);
    delete nodesAndEdges.graph;
    const foldedNode = {
      id: "fold-c2-1",
      category: "c2",
      depth: null,
      href: null,
      icon: undefined,
      isFolded: true,
      foldedNodes: [
        { id: node_c2_1.id, title: node_c2_1.title },
        { id: node_c2_2.id, title: node_c2_2.title },
      ],
      row_data: null,
      symbol: null,
      title: null,
    };
    expect(nodesAndEdges).toEqual({
      nodeCategoryMap: {
        c1: {
          [node_c1_1.id]: node_c1_1,
        },
        c2: {
          [node_c2_3.id]: node_c2_3,
          [foldedNode.id]: foldedNode,
        },
        c3: {
          [node_c3_1.id]: node_c3_1,
        },
        c4: {
          [node_c4_1.id]: node_c4_1,
        },
      },
      nodeMap: {
        [node_c1_1.id]: node_c1_1,
        [node_c2_3.id]: node_c2_3,
        [node_c3_1.id]: node_c3_1,
        [node_c4_1.id]: node_c4_1,
        [foldedNode.id]: foldedNode,
      },
      nodes: [node_c1_1, node_c2_3, node_c3_1, node_c4_1, foldedNode],
      edgeMap: {
        [edge_c1_1_c2_3.id]: edge_c1_1_c2_3,
        [edge_c3_1_c2_3.id]: edge_c3_1_c2_3,
        [edge_c4_1_c2_3.id]: edge_c4_1_c2_3,
        "c1-1_fold-c2-1": {
          id: "c1-1_fold-c2-1",
          from_id: "c1-1",
          to_id: "fold-c2-1",
          category: null,
          title: null,
        },
        "c3-1_fold-c2-1": {
          id: "c3-1_fold-c2-1",
          from_id: "c3-1",
          to_id: "fold-c2-1",
          category: null,
          title: null,
        },
      },
      edges: [
        edge_c1_1_c2_3,
        edge_c3_1_c2_3,
        edge_c4_1_c2_3,
        {
          id: "c1-1_fold-c2-1",
          from_id: "c1-1",
          to_id: "fold-c2-1",
          category: null,
          title: null,
        },
        {
          id: "c3-1_fold-c2-1",
          from_id: "c3-1",
          to_id: "fold-c2-1",
          category: null,
          title: null,
        },
      ],
      root_nodes: {
        [node_c1_1.id]: node_c1_1,
        [node_c3_1.id]: node_c3_1,
        [node_c4_1.id]: node_c4_1,
      },
      categories: {
        [category_1.id]: category_1,
        [category_2.id]: category_2,
        [category_3.id]: category_3,
        [category_4.id]: category_4,
      },
    });
  });
});
