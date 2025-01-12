
import { useEffect, useState } from "react";
import LineChart from "../../chart/lineChart";
import "bootstrap-notify"
// import $ from "jquery"

import { Sparklines, SparklinesLine, SparklinesBars, SparklinesSpots } from "react-sparklines";
import axios from "axios";


const Dashboard = () => {



    // const AfficherNotification = () => {
    //     $.notify(
    //         {
    //             message: "Donnees enregistre avec succes.",
    //         },
    //         {
    //             type: "success",
    //             placement: {
    //                 from: "top",
    //                 align: "right",
    //             },
    //             delay: 2000,
    //             timer: 500,
    //         }
    //     );
    // };

    useEffect(() => {
        getCountStudent();
    }, []);

    const data = [5, 10, 5, 20, 8, 15, 12, 18, 25];
    const [EtuData, setEtuData] = useState("");

    const getCountStudent = () => {
        axios.get('http://localhost:5000/api/etudiants/count')
            .then((rep) => {
                setEtuData(rep.data);
            })
            .catch((rep) => {
                console.log(rep.message);
            })
    }



    return (
        <div className="container">
            <div className="page-inner">
                <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row pt-2 pb-4">
                    <div>
                        <h3 className="fw-bold mb-3">Tableau de bord</h3>
                    </div>


                    {/* Bouton Ajoouter  */}
                    {/* <div className="ms-md-auto py-2 py-md-0">
                        <a href="#" className="btn btn-label-info btn-round me-2">Controler</a>
                        <a href="#" className="btn btn-primary btn-round">Ajouter Etudiants</a>
                    </div> */}


                </div>

                <div className="row">
                    <div className="col-sm-6 col-md-3">
                        <div className="card card-stats card-round">
                            <div className="card-body">
                                <div className="row align-items-center">
                                    <div className="col-icon">
                                        <div className="icon-big text-center icon-primary bubble-shadow-small">
                                            <i className="fas fa-users"></i>
                                        </div>
                                    </div>
                                    <div className="col col-stats ms-3 ms-sm-0">
                                        <div className="numbers">
                                            <p className="card-category">Actifs</p>
                                            <h4 className="card-title">1,294</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-6 col-md-3">
                        <div className="card card-stats card-round">
                            <div className="card-body">
                                <div className="row align-items-center">
                                    <div className="col-icon">
                                        <div className="icon-big text-center icon-info bubble-shadow-small">
                                            <i className="fas fa-user-check"></i>
                                        </div>
                                    </div>
                                    <div className="col col-stats ms-3 ms-sm-0">
                                        <div className="numbers">
                                            <p className="card-category">Utilisateurs</p>
                                            <h4 className="card-title">1,303</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-6 col-md-3">
                        <div className="card card-stats card-round">
                            <div className="card-body">
                                <div className="row align-items-center">
                                    <div className="col-icon">
                                        <div className="icon-big text-center icon-success bubble-shadow-small">
                                            <i className="icon-graduation"></i>
                                        </div>
                                    </div>
                                    <div className="col col-stats ms-3 ms-sm-0">
                                        <div className="numbers">
                                            <p className="card-category">Etudiants</p>
                                            <h4 className="card-title">{EtuData}</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-6 col-md-3">
                        <div className="card card-stats card-round">
                            <div className="card-body">
                                <div className="row align-items-center">
                                    <div className="col-icon">
                                        <div className="icon-big text-center icon-secondary bubble-shadow-small">
                                            <i className="icon-wallet"></i>
                                        </div>
                                    </div>
                                    <div className="col col-stats ms-3 ms-sm-0">
                                        <div className="numbers">
                                            <p className="card-category">Order</p>
                                            <h4 className="card-title">576</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8">
                        <div className="card card-round">
                            <div className="card-header">
                                <div className="card-head-row">
                                    <div className="card-title">Statistiques des utilisateurs</div>
                                    <div className="card-tools">
                                        <div className="btn btn-label-success btn-round btn-sm me-2">
                                            <span className="btn-label">
                                                <i className="fa fa-pencil"></i>
                                            </span>
                                            Exporter
                                        </div>
                                        <div className="btn btn-label-info btn-round btn-sm">
                                            <span className="btn-label">
                                                <i className="fa fa-print"></i>
                                            </span>
                                            Imprimer
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="card-body">
                                <div className="chart-container" style={{ minHeight: "375px" }}>
                                    {/* // style="min-height: 375px */}
                                    {/* <canvas id="statisticsChart"></canvas> */}
                                    <LineChart></LineChart>
                                </div>
                                {/* <div id="myChartLegend"></div> */}
                            </div>


                        </div>
                    </div>


                    <div className="col-md-4">
                        {/* <div className="card card-primary card-round">
                                <div className="card-header">
                                    <div className="card-head-row">
                                        <div className="card-title">Daily Sales</div>
                                        <div className="card-tools">
                                            <div className="dropdown">
                                                <button className="btn btn-sm btn-label-light dropdown-toggle" type="button" id="dropdownMenuButton"
                                                    data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    Export
                                                </button>
                                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                    <a className="dropdown-item" href="#">Action</a>
                                                    <a className="dropdown-item" href="#">Another action</a>
                                                    <a className="dropdown-item" href="#">Something else here</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-category">March 25 - April 02</div>
                                </div>
                                <div className="card-body pb-0">
                                    <div className="mb-4 mt-2">
                                        <h1>$4,578.58</h1>
                                    </div>
                                    <div className="pull-in">
                                        <canvas id="dailySalesChart"></canvas>
                                    </div>
                                </div>
                            </div> */}


                        <div className="card card-round">
                            <div className="card-body pb-0">
                                <div className="h1 fw-bold float-end text-primary">+5%</div>
                                <h2 className="mb-2">17</h2>
                                <p className="text-muted">Utilisateurs Actif</p>
                                <div className="pull-in sparkline-fix">
                                    <Sparklines data={data} limit={10} width={100} height={40} margin={5}>
                                        <SparklinesLine color="#177dff" style={{ strokeWidth: 0.2, fill: "red" }} />
                                    </Sparklines>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;