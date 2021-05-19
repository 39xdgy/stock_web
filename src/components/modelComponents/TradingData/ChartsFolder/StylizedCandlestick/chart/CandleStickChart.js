import {
  Bar,
  Line,
  Group,
  Tooltip,
  withTooltip,
  withScreenSize,
  withParentSize,
  scaleTime,
  scaleBand,
  scaleLinear,
  LinearGradient,
  localPoint,
  GridColumns,
  GridRows,
  AxisRight,
  AxisLeft,
  AxisBottom,
  GradientOrangeRed
} from "@vx/vx";
import * as d3 from "d3";
import Volume from "./VolumeDisplay";
import Details from "./DetailsDisplay";
import TimeMarker from "./TimeMarkerDisplay";
import HoverMarkers from "./HoverMarkersDisplay";
import React from "react";

const formatPrice = d3.format("$,.2f");
const formatNumber = d3.format(",.0f");
const formatTime = d3.timeFormat("%I:%M%p");

const xStock = d => new Date(d.date);
const xSelector = d => new Date(d.date);
const ySelector = d => d.price;
const bisectDate = d3.bisector(xSelector).left;
class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeBucket: undefined,
      yPoint: undefined
    };
  }

  handleTooltip = ({ event, data, xSelector, xScale, yScale }) => {
    console.log(`INSIDE HANDLE TOOLTIP${data}${event}`);
    const { showTooltip } = this.props;
    const { x } = localPoint(event);
    const x0 = xScale.invert(x);
    const index = bisectDate(data, x0, 1);
    const d0 = data[index - 1];
    const d1 = data[index];
    let d = d0;
    if (d1 && d1.date) {
      d = x0 - xSelector(d0) > xSelector(d1) - x0 ? d1 : d0;
    }
    showTooltip({
      tooltipData: d,
      tooltipLeft: xScale(xSelector(d)),
      tooltipTop: yScale(ySelector(d))
    });
  };

  render() {
    const {
      parentWidth,
      parentHeight,
      data,
      showTooltip,
      hideTooltip,
      tooltipLeft,
      tooltipTop,
      tooltipData
    } = this.props;
    const { buckets, start, end, maxHighPrice, minLowPrice, maxVolume } = data;
    const { activeBucket, yPoint } = this.state;

    const margin = {
      top: 0,
      left: 0,
      right: 40,
      bottom: 80
    };

    const width = parentWidth;
    const height = parentHeight;

    const xScale = scaleBand({
      range: [0, width - margin.right],
      domain: buckets.map(b => b.date),
      padding: 0.3
    });
    const timeScale = scaleTime({
      range: [0, width - margin.right],
      domain: [start, end]
    });
    const yScale = scaleLinear({
      range: [height - margin.bottom, 20],
      domain: [minLowPrice, maxHighPrice]
    });

    const volumeHeight = (height - margin.bottom) * 0.2;
    const yVolumeScale = scaleLinear({
      range: [volumeHeight, 0],
      domain: [0, maxVolume]
    });

    return (
      <div>
        <svg width={width} height={height} ref={s => (this.svg = s)}>
          <defs>
            <GradientOrangeRed id='OrangeRed' />
          </defs>
          <Group top={margin.top} left={margin.left}>
            <rect width={width} height={height} fill='url(#OrangeRed)' />
            <GridRows
              lineStyle={{ pointerEvents: "none" }}
              width={width - margin.right}
              height={height}
              scale={yScale}
              stroke='rgba(255,255,255,0.2)'
            />
            <GridColumns
              lineStyle={{ pointerEvents: "none" }}
              width={width}
              height={height - margin.bottom}
              scale={timeScale}
              stroke='rgba(255,255,255,0.1)'
            />
          </Group>
          {buckets.map(b => {
            return (
              <g key={`b-${b.date}`}>
                <line
                  //CANDLESTICK BOTTOM WICK
                  x1={xScale(b.date) + xScale.bandwidth() / 2}
                  x2={xScale(b.date) + xScale.bandwidth() / 2}
                  y1={yScale(b.high)}
                  y2={b.hollow ? yScale(b.close) : yScale(b.low)}
                  stroke='white'
                  strokeWidth={1}
                />

                <Bar
                  data={b}
                  width={xScale.bandwidth()}
                  height={
                    b.hollow
                      ? yScale(b.open) - yScale(b.close)
                      : yScale(b.close) - yScale(b.open)
                  }
                  fill={b.hollow ? "transparent" : "white"}
                  stroke={b.hollow ? "white" : "transparent"}
                  strokeWidth={1}
                  x={xScale(b.date)}
                  y={b.hollow ? yScale(b.close) : yScale(b.open)}
                />
                <Group top={height - margin.bottom - volumeHeight}>
                  <Bar
                    data={b}
                    width={xScale.bandwidth()}
                    height={volumeHeight - yVolumeScale(b.volume)}
                    x={xScale(b.date)}
                    y={yVolumeScale(b.volume)}
                    fill={b.hollow ? "transparent" : "white"}
                    stroke={b.hollow ? "white" : "transparent"}
                    fillOpacity={0.7}
                    strokeOpacity={0.7}
                  />
                </Group>
                
              </g>
            );
          })}
          <Group top={height - margin.bottom - volumeHeight}>
            <AxisRight
              id='VOLUME_AXIS'
              scale={yVolumeScale}
              hideZero
              hideTicks
              hideAxisLine
              tickStroke='white'
              tickValues={yVolumeScale.ticks(3)}
              tickLabelProps={(value, index) => ({
                dx: "2em",
                dy: "-0.5em",
                textAnchor: "middle",
                fill: "black",
                fontSize: 8,
                fillOpacity: 0.8
              })}
            />
          </Group>
          <AxisLeft
            id='PRICE_AXIS'
            left={width}
            scale={yScale}
            hideAxisLine
            hideTicks
            hideZero
            tickFormat={formatPrice}
            tickStroke='black'
            tickValues={yScale.ticks(3)}
            tickLabelProps={(value, index) => ({
              dy: "0.5em",
              textAnchor: "end",
              fill: "black",
              fontSize: 8,
              fillOpacity: 0.8
            })}
          />
          {activeBucket && (
            <HoverMarkers
              xScale={xScale}
              yScale={yScale}
              height={height}
              width={width}
              margin={margin}
              time={activeBucket.date}
              yPoint={yPoint}
              formatPrice={formatPrice}
            />
          )}
          <Bar
            data={data}
            width={width}
            height={height - margin.bottom}
            fill='transparent'

            onMouseMove={event => {
              const { x: xPoint, y: yPoint } = localPoint(this.svg, event);
              const bandWidth = xScale.step();
              const index = Math.floor(xPoint / bandWidth);
              const val = buckets[index];
              this.setState({
                activeBucket: val,
                yPoint
              });
            }}
            onMouseLeave={event =>
              this.setState({ activeBucket: undefined, yPoint: undefined })
            }
          />
          <AxisBottom
            top={height - margin.bottom}
            scale={timeScale}
            stroke='rgba(255,255,255,0.5)'
            tickStroke='rgba(255,255,255,0.5)'
            tickFormat={d3.timeFormat("%Y-%m-%d")}
            tickLabelProps={(value, index) => ({
              textAnchor: "middle",
              fill: "white",
              fontSize: 8,
              fillOpacity: 0.8
            })}
          />
          
        </svg>
        {activeBucket && (
          <div>
            <TimeMarker
              top={height - margin.bottom + 3}
              xScale={xScale}
              formatTime={d3.timeFormat("%Y-%m-%d")}
              time={activeBucket.date}
            />
            <Details
              yScale={yScale}
              xScale={xScale}
              formatPrice={formatPrice}
              formatNumber={formatNumber}
              bucket={activeBucket}
            />
          </div>
        )}
        
      </div>
    );
  }
}

export default withParentSize(withTooltip(Chart));
