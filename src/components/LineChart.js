import React, { Component } from "react";
import { Line } from "react-chartjs-2";

export default class LineChart extends Component {
  state = {
    data: {},
    options: {},
    newdata: {},
  };

  componentDidMount = () => {
    setTimeout(() => {
      var data = {
        labels: [...Array(this.props.overallEndorsement?.length).keys()],
        datasets: [
          {
            label: "Endorse Rating Spread",
            data: this.props.overallEndorsement,
            fill: false,
            backgroundColor: "white",
            borderColor: "rgba(255,255,255,0.3)",
          },
        ],
      };

      var options = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      };
      this.setState({
        data,
        options,
      });
    }, 1000);
  };
  render() {
    return <Line data={this.state.data} options={this.state.options} />;
  }
}