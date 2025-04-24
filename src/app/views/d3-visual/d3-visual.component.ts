import { Component, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, SankeyNode, SankeyLink } from 'd3-sankey';

interface CustomNode extends SankeyNode<{}, CustomLink> {
  name: string;
  color?: string;
  index?: number;
}

interface CustomLink extends SankeyLink<CustomNode, {}> {
  value: number;
}

@Component({
  selector: 'app-d3-visual',
  templateUrl: './d3-visual.component.html',
  styleUrls: ['./d3-visual.component.scss']
})
export class D3VisualComponent implements AfterViewInit {
  rawData: { nodes: CustomNode[]; links: CustomLink[] } = { nodes: [], links: [] };
  filters = {
    plans: [] as string[],
    selectedPlan: 'All'
  };

  async ngAfterViewInit(): Promise<void> {
    const url = `${window.location.origin}/assets/sankey_customer_journey_pretty.json`;
    const json = await fetch(url).then(res => res.json());
    this.rawData = json;

    this.filters.plans = Array.from(
      new Set(
        this.rawData.nodes
          .map(n => n.name)
          .filter(name => name.toLowerCase().includes('plan'))
      )
    );

    this.renderChart();
  }

  onFilterChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.filters.selectedPlan = value;
    this.renderChart();
  }

  filteredData() {
    if (this.filters.selectedPlan === 'All') {
      return this.rawData;
    }

    const startNodeIndex = this.rawData.nodes.findIndex(n => n.name === this.filters.selectedPlan);
    if (startNodeIndex === -1) return this.rawData;

    const usedLinks = this.rawData.links.filter(link => link.source === startNodeIndex);

    const nodeSet = new Set<number>();
    usedLinks.forEach(link => {
      nodeSet.add(link.source as number);
      nodeSet.add(link.target as number);
    });

    const filteredNodes = this.rawData.nodes
      .map((node, index) => ({ ...node, index }))
      .filter((_, idx) => nodeSet.has(idx));

    const indexMap = new Map<number, number>();
    filteredNodes.forEach((node, newIndex) => indexMap.set(node.index!, newIndex));

    const filteredLinks = usedLinks.map(link => ({
      ...link,
      source: indexMap.get(link.source as number)!,
      target: indexMap.get(link.target as number)!
    }));

    return { nodes: filteredNodes, links: filteredLinks };
  }

  renderChart(): void {
    const { nodes, links } = this.filteredData();
    if (!nodes.length || !links.length) return;

    const width = 1000;
    const height = 600;

    const svg = d3.select('#sankeyChart')
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();

    const sankeyLayout = sankey<CustomNode, CustomLink>()
      .nodeWidth(20)
      .nodePadding(15)
      .extent([[1, 1], [width - 1, height - 6]]);

    const graph = sankeyLayout({
      nodes: nodes.map(d => ({ ...d })),
      links: links.map(d => ({ ...d }))
    });

    svg.append('g')
      .selectAll('path')
      .data(graph.links)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('fill', 'none')
      .attr('stroke', '#aaa')
      .attr('stroke-width', d => Math.max(1, d.width ?? 0))
      .attr('opacity', 0.6)
      .append('title')
      .text(d => `${(d.source as CustomNode).name} → ${(d.target as CustomNode).name}\n${d.value}`);

    const node = svg.append('g')
      .selectAll('g')
      .data(graph.nodes)
      .join('g')
      .attr('transform', d => `translate(${d.x0},${d.y0})`);

    node.append('rect')
      .attr('height', d => (d.y1 ?? 0) - (d.y0 ?? 0))
      .attr('width', d => (d.x1 ?? 0) - (d.x0 ?? 0))
      .attr('fill', d => d.color || '#69b3a2');

    node.append('text')
      .attr('x', -6)
      .attr('y', d => ((d.y1 ?? 0) - (d.y0 ?? 0)) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .text(d => d.name)
      .filter(d => (d.x0 ?? 0) < width / 2)
      .attr('x', 26)
      .attr('text-anchor', 'start');
  }
}
