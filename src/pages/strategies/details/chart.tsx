// /* eslint-disable react/jsx-curly-brace-presence */

const data = [
  [
    { x: 1, y: 1 },
    { x: 2, y: 2 },
    { x: 3, y: 3 },
    { x: 4, y: 4 },
  ],
  [
    { x: 1, y: 400 },
    { x: 2, y: 350 },
    { x: 3, y: 300 },
    { x: 4, y: 250 },
  ],
  [
    { x: 1, y: 75 },
    { x: 2, y: 85 },
    { x: 3, y: 95 },
    { x: 4, y: 100 },
  ],
];
// find maxima for normalizing data
const maxima = data.map((dataset) => Math.max(...dataset.map((d) => d.y)));

const xOffsets = [50, 200, 350];
const tickPadding = [0, 0, -15];
const anchors = ['end', 'end', 'start'];
const colors = ['black', 'red', 'blue'];

export class App extends React.Component {
  render() {
    return (
      <div>
        <VictoryChart theme={VictoryTheme.material} width={400} height={400} domain={{ y: [0, 1] }}>
          <VictoryAxis />
          {data.map((d, i) => (
            <VictoryAxis
              dependentAxis
              key={i}
              offsetX={xOffsets[i]}
              style={{
                axis: { stroke: colors[i] },
                ticks: { padding: tickPadding[i] },
                tickLabels: { fill: colors[i], textAnchor: anchors[i] },
              }}
              // Use normalized tickValues (0 - 1)
              tickValues={[0.25, 0.5, 0.75, 1]}
              // Re-scale ticks by multiplying by correct maxima
              tickFormat={(t) => t * maxima[i]}
            />
          ))}
          {data.map((d, i) => (
            <VictoryLine
              key={i}
              data={d}
              style={{ data: { stroke: colors[i] } }}
              // normalize data
              y={(datum) => datum.y / maxima[i]}
            />
          ))}
        </VictoryChart>
      </div>
    );
  }
}

// ReactDOM.render(<App />, mountNode);
// import React from 'react';
// import { VictoryAxis, VictoryLabel, VictoryLine } from 'victory';

// /* eslint-disable react/sort-comp */
// export class CustomTheme extends React.Component {
//   render() {
//     const styles = this.getStyles();
//     const dataSetOne = this.getDataSetOne();
//     const dataSetTwo = this.getDataSetTwo();
//     const tickValues = this.getTickValues();

//     return (
//       <svg style={styles.parent} viewBox="0 0 450 350">
//         <g transform={'translate(0, 40)'}>
//           {/* Add shared independent axis */}
//           <VictoryAxis
//             scale="time"
//             standalone={false}
//             style={styles.axisYears}
//             tickValues={tickValues}
//             tickFormat={(x) => {
//               if (x.getFullYear() === 2000) {
//                 return x.getFullYear();
//               }
//               if (x.getFullYear() % 5 === 0) {
//                 return x.getFullYear().toString().slice(2);
//               }
//             }}
//           />

//           {/*
//             Add the dependent axis for the first data set.
//             Note that all components plotted against this axis will have the same y domain
//           */}
//           <VictoryAxis
//             dependentAxis
//             domain={[-10, 15]}
//             offsetX={50}
//             orientation="left"
//             standalone={false}
//             style={styles.axisOne}
//           />

//           {/* Red annotation line */}
//           <VictoryLine
//             data={[
//               { x: new Date(1999, 1, 1), y: 0 },
//               { x: new Date(2014, 6, 1), y: 0 },
//             ]}
//             domain={{
//               x: [new Date(1999, 1, 1), new Date(2016, 1, 1)],
//               y: [-10, 15],
//             }}
//             scale={{ x: 'time', y: 'linear' }}
//             standalone={false}
//             style={styles.lineThree}
//           />

//           {/* dataset one */}
//           <VictoryLine
//             data={dataSetOne}
//             domain={{
//               x: [new Date(1999, 1, 1), new Date(2016, 1, 1)],
//               y: [-10, 15],
//             }}
//             interpolation="monotoneX"
//             scale={{ x: 'time', y: 'linear' }}
//             standalone={false}
//             style={styles.lineOne}
//           />

//           {/*
//             Add the dependent axis for the second data set.
//             Note that all components plotted against this axis will have the same y domain
//           */}
//           <VictoryAxis dependentAxis domain={[0, 50]} orientation="right" standalone={false} style={styles.axisTwo} />

//           {/* dataset two */}
//           <VictoryLine
//             data={dataSetTwo}
//             domain={{
//               x: [new Date(1999, 1, 1), new Date(2016, 1, 1)],
//               y: [0, 50],
//             }}
//             interpolation="monotoneX"
//             scale={{ x: 'time', y: 'linear' }}
//             standalone={false}
//             style={styles.lineTwo}
//           />
//         </g>
//       </svg>
//     );
//   }

//   getDataSetOne() {
//     return [
//       { x: new Date(2000, 1, 1), y: 12 },
//       { x: new Date(2000, 6, 1), y: 10 },
//       { x: new Date(2000, 12, 1), y: 11 },
//       { x: new Date(2001, 1, 1), y: 5 },
//       { x: new Date(2002, 1, 1), y: 4 },
//       { x: new Date(2003, 1, 1), y: 6 },
//       { x: new Date(2004, 1, 1), y: 5 },
//       { x: new Date(2005, 1, 1), y: 7 },
//       { x: new Date(2006, 1, 1), y: 8 },
//       { x: new Date(2007, 1, 1), y: 9 },
//       { x: new Date(2008, 1, 1), y: -8.5 },
//       { x: new Date(2009, 1, 1), y: -9 },
//       { x: new Date(2010, 1, 1), y: 5 },
//       { x: new Date(2013, 1, 1), y: 1 },
//       { x: new Date(2014, 1, 1), y: 2 },
//       { x: new Date(2015, 1, 1), y: -5 },
//     ];
//   }

//   getDataSetTwo() {
//     return [
//       { x: new Date(2000, 1, 1), y: 5 },
//       { x: new Date(2003, 1, 1), y: 6 },
//       { x: new Date(2004, 1, 1), y: 4 },
//       { x: new Date(2005, 1, 1), y: 10 },
//       { x: new Date(2006, 1, 1), y: 12 },
//       { x: new Date(2007, 2, 1), y: 48 },
//       { x: new Date(2008, 1, 1), y: 19 },
//       { x: new Date(2009, 1, 1), y: 31 },
//       { x: new Date(2011, 1, 1), y: 49 },
//       { x: new Date(2014, 1, 1), y: 40 },
//       { x: new Date(2015, 1, 1), y: 21 },
//     ];
//   }

//   getTickValues() {
//     return [
//       new Date(1999, 1, 1),
//       new Date(2000, 1, 1),
//       new Date(2001, 1, 1),
//       new Date(2002, 1, 1),
//       new Date(2003, 1, 1),
//       new Date(2004, 1, 1),
//       new Date(2005, 1, 1),
//       new Date(2006, 1, 1),
//       new Date(2007, 1, 1),
//       new Date(2008, 1, 1),
//       new Date(2009, 1, 1),
//       new Date(2010, 1, 1),
//       new Date(2011, 1, 1),
//       new Date(2012, 1, 1),
//       new Date(2013, 1, 1),
//       new Date(2014, 1, 1),
//       new Date(2015, 1, 1),
//       new Date(2016, 1, 1),
//     ];
//   }

//   getStyles() {
//     const BLUE_COLOR = '#00a3de';
//     const RED_COLOR = '#7c270b';

//     return {
//       parent: {
//         background: '#ccdee8',
//         boxSizing: 'border-box',
//         display: 'inline',
//         padding: 0,
//         fontFamily: "'Fira Sans', sans-serif",
//       },
//       title: {
//         textAnchor: 'start',
//         verticalAnchor: 'end',
//         fill: '#000000',
//         fontFamily: 'inherit',
//         fontSize: '18px',
//         fontWeight: 'bold',
//       },
//       labelNumber: {
//         textAnchor: 'middle',
//         fill: '#ffffff',
//         fontFamily: 'inherit',
//         fontSize: '14px',
//       },

//       // INDEPENDENT AXIS
//       axisYears: {
//         axis: { stroke: 'black', strokeWidth: 1 },
//         ticks: {
//           size: ({ tick }) => {
//             const tickSize = tick.getFullYear() % 5 === 0 ? 10 : 5;
//             return tickSize;
//           },
//           stroke: 'black',
//           strokeWidth: 1,
//         },
//         tickLabels: {
//           fill: 'black',
//           fontFamily: 'inherit',
//           fontSize: 16,
//         },
//       },

//       // DATA SET ONE
//       axisOne: {
//         grid: {
//           stroke: ({ tick }) => (tick === -10 ? 'transparent' : '#ffffff'),
//           strokeWidth: 2,
//         },
//         axis: { stroke: BLUE_COLOR, strokeWidth: 0 },
//         ticks: { strokeWidth: 0 },
//         tickLabels: {
//           fill: BLUE_COLOR,
//           fontFamily: 'inherit',
//           fontSize: 16,
//         },
//       },
//       labelOne: {
//         fill: BLUE_COLOR,
//         fontFamily: 'inherit',
//         fontSize: 12,
//         fontStyle: 'italic',
//       },
//       lineOne: {
//         data: { stroke: BLUE_COLOR, strokeWidth: 4.5 },
//       },
//       axisOneCustomLabel: {
//         fill: BLUE_COLOR,
//         fontFamily: 'inherit',
//         fontWeight: 300,
//         fontSize: 21,
//       },

//       // DATA SET TWO
//       axisTwo: {
//         axis: { stroke: RED_COLOR, strokeWidth: 0 },
//         tickLabels: {
//           fill: RED_COLOR,
//           fontFamily: 'inherit',
//           fontSize: 16,
//         },
//       },
//       labelTwo: {
//         textAnchor: 'end',
//         fill: RED_COLOR,
//         fontFamily: 'inherit',
//         fontSize: 12,
//         fontStyle: 'italic',
//       },
//       lineTwo: {
//         data: { stroke: RED_COLOR, strokeWidth: 4.5 },
//       },

//       // HORIZONTAL LINE
//       lineThree: {
//         data: { stroke: '#e95f46', strokeWidth: 2 },
//       },
//     };
//   }
// }
