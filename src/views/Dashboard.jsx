import React from "react";

import { isAuthenticated } from "../services/auth";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col
} from "reactstrap";
import { Doughnut, Chart } from 'react-chartjs-2';
import api from "../services/api";

const originalDoughnutDraw = Chart.controllers.doughnut.prototype.draw;
Chart.helpers.extend(Chart.controllers.doughnut.prototype, {
  draw: function () {
    originalDoughnutDraw.apply(this, arguments);

    var chart = this.chart.chart;
    var ctx = chart.ctx;
    var width = chart.width;
    var height = chart.height;

    var fontSize = (height / 114).toFixed(2);
    ctx.font = fontSize + "em Verdana";
    ctx.textBaseline = "middle";

    var text = chart.config.data.text,
      textX = Math.round((width - ctx.measureText(text).width) / 2),
      textY = height / 2;

    ctx.fillText(text, textX, textY);
  }
});

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataChartUser: {},
      dataChartPicture: {},
      query: '',
      count_users: 0,
      count_pictures: 0,
      count_deleteds: 0,
      count_not_deleteds: 0,
    }
  }
  async componentDidMount() {
    if (!isAuthenticated()) {
      return this.props.history.push('/signin');
    }
    try {
      // const responseNotDeleted = await api.get(`/users?by_deleted_at=empty`);
      // const responseDeleted = await api.get(`/users?by_deleted_at=present`);
      const responseUser = await api.get(`/users`);
      const responsePicture = await api.get(`/pictures`);
      
      this.setState({
        // count_not_deleteds: responseNotDeleted.data.docs.length,
        // count_deleteds: responseDeleted.data.docs.length
        count_users: responseUser.data.docs.length,
        count_pictures: responsePicture.data.docs.length
      });

    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    }
    const dataChartUser = {
      labels: [
        'Green',
        'Yellow'
      ],
      datasets: [{
        data: [this.state.count_users],
        backgroundColor: [
          '#36A2EB',
          '#FFCE56'
        ],
        hoverBackgroundColor: [
          '#36A2EB',
          '#FFCE56'
        ]
      }],
      text: this.state.count_users,
    };
    const dataChartPicture = {
      labels: [
        'Green',
        'Yellow'
      ],
      datasets: [{
        data: [this.state.count_pictures],
        backgroundColor: [
          '#FFCE56',
          '#36A2EB',
        ],
        hoverBackgroundColor: [
          '#FFCE56',
          '#36A2EB',
        ]
      }],
      text: this.state.count_pictures,
    };
    this.setState({ dataChartUser, dataChartPicture });
  }
  render() {
    const { dataChartUser, dataChartPicture } = this.state;
    return (
      <div className="content">
        <Row>
          <Col md="4">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">User Statistics</CardTitle>
                <p className="card-category">Created users</p>
              </CardHeader>
              <CardBody>
                <Doughnut data={dataChartUser} options={{ legend: { display: false } }} />
              </CardBody>
            </Card>
          </Col>
          <Col md="4">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Picture Statistics</CardTitle>
                <p className="card-category">Created pictures</p>
              </CardHeader>
              <CardBody>
                <Doughnut data={dataChartPicture} options={{ legend: { display: false } }} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
