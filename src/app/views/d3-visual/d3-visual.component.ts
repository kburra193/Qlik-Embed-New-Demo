import { Component, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-d3-visual',
  templateUrl: './d3-visual.component.html',
  styleUrls: ['./d3-visual.component.scss']
})
export class D3VisualComponent implements AfterViewInit {

  ngAfterViewInit() {
    const data = [
      { segment: 'A', churn: 0.12 },
      { segment: 'B', churn: 0.25 },
      { segment: 'C', churn: 0.18 },
      { segment: 'D', churn: 0.05 }
    ];

    const svg = d3.select('#d3-chart');
    const width = +svg.attr('width');
    const height = +svg.attr('height');

    const x = d3.scaleBand()
      .domain(data.map(d => d.segment))
      .range([40, width - 20])
      .padding(0.4);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.churn)! * 1.2])
      .range([height - 40, 20]);

    // X Axis
    svg.append('g')
      .attr('transform', `translate(0, ${height - 40})`)
      .call(d3.axisBottom(x));

    // Y Axis
    svg.append('g')
      .attr('transform', `translate(40, 0)`)
      .call(d3.axisLeft(y).tickFormat(d3.format(".0%")));

    // Tooltip div
    const tooltip = d3.select('#tooltip');

    // Bars with animation
    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.segment)!)
      .attr('width', x.bandwidth())
      .attr('y', height - 40)
      .attr('height', 0)
      .attr('fill', '#3B82F6')
      .on('mouseover', function (event, d) {
        tooltip
          .style('opacity', 1)
          .html(`Segment ${d.segment}<br/>Churn: ${(d.churn * 100).toFixed(1)}%`)
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 20}px`);
      })
      .on('mousemove', function (event) {
        tooltip
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 20}px`);
      })
      .on('mouseout', function () {
        tooltip.style('opacity', 0);
      })
      .transition()
      .duration(800)
      .attr('y', d => y(d.churn))
      .attr('height', d => height - 40 - y(d.churn));
  }
}
