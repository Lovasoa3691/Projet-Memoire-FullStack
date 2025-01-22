
import { useEffect, useState } from "react";
import LineChart from "../../chart/lineChart";
import PieChart from "../../chart/pieChart";
import BarChart from "../../chart/barChart";
import { Sparklines, SparklinesLine, SparklinesBars, SparklinesSpots } from "react-sparklines";
import axios from "axios";
import api from "../API/api";


const Dashboard = () => {

    const [data, setData] = useState(0);
    const [examCount, setExamCount] = useState(0);
    const [examProcessingCount, setExamProcessingCount] = useState(0);
    const [examTermineCount, setExamTermineCount] = useState(0);
    const [insCount, setInsCount] = useState(0);

    const getDataInfo = () => {
        api.get('/etudiants/count')
            .then((rep) => {
                setData(rep.data)
            })
    }

    const getExamCount = () => {
        api.get('/examens/all/count')
            .then((rep) => {
                setExamCount(rep.data.examCount)
            })
    }

    const getExamProcessCount = () => {
        api.get('/examens/encours/count')
            .then((rep) => {
                setExamProcessingCount(rep.data.examCount)
                setExamTermineCount(rep.data.examTermine)
            })
    }

    const getInsCount = () => {
        api.get('/inscriptions/etudiants/all')
            .then((rep) => {
                setInsCount(rep.data.inscriptionCount)
            })
    }

    useEffect(() => {
        getDataInfo();
        getExamCount();
        getExamProcessCount();
        getInsCount();
    }, [])

    return (
        <div className="container">
            <div className="page-inner">
                <div className="d-flex align-items-left align-items-md-center flex-column flex-md-row pt-2 pb-4">
                    <div>
                        <h3 className="fw-bold mb-3">Tableau de bord</h3>
                    </div>
                </div>
                <div className="row mt--4">
                    <div className="col-sm-6 col-lg-3">
                        <div className="card p-3">
                            <div className="d-flex align-items-center">
                                <span className="stamp stamp-md bg-secondary me-3">
                                    <i className="fa fa-dollar-sign"></i>
                                </span>
                                <div>
                                    <h5 className="mb-1">
                                        <b
                                        ><a>{examCount} <small></small></a></b
                                        >
                                    </h5>
                                    <small className="text-muted">Examens planifies</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-lg-3">
                        <div className="card p-3">
                            <div className="d-flex align-items-center">
                                <span className="stamp stamp-md bg-warning me-3">
                                    <i className="fa fa-comment-alt"></i>
                                </span>
                                <div>
                                    <h5 className="mb-1">
                                        <b
                                        ><a>{examProcessingCount} <small>En Cours</small></a></b
                                        >
                                    </h5>
                                    <small className="text-muted">{examTermineCount} Termine</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-lg-3">
                        <div className="card p-3">
                            <div className="d-flex align-items-center">
                                <span className="stamp stamp-md bg-success me-3">
                                    <i className="fa fa-shopping-cart"></i>
                                </span>
                                <div>
                                    <h5 className="mb-1">
                                        <b
                                        ><a>{data} <small></small></a></b
                                        >
                                    </h5>
                                    <small className="text-muted">Total etudiants</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 col-lg-3">
                        <div className="card p-3">
                            <div className="d-flex align-items-center">
                                <span className="stamp stamp-md bg-danger me-3">
                                    <i className="fa fa-users"></i>
                                </span>
                                <div>
                                    <h5 className="mb-1">
                                        <b
                                        ><a>{insCount} <small></small></a></b
                                        >
                                    </h5>
                                    <small className="text-muted">Etudiants inscrits</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4">
                        <div className="card card-round">
                            <div className="card-header">
                                <div className="card-head-row">
                                    <div className="card-title">Statistiques des etudiants</div>
                                </div>
                            </div>

                            <div className="card-body">
                                <div className="chart-container" >
                                    <PieChart></PieChart>
                                    {/* <BarChart></BarChart> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-title">Les 7 prochaine examens a suivre du session S5</div>
                            </div>
                            <div className="card-body">

                                <table className="table table-head-bg-primary mt-0">
                                    <thead>
                                        <tr>
                                            <th scope="col">Date</th>
                                            <th scope="col">Matiere</th>
                                            <th scope="col">Horaire</th>
                                            <th scope="col">classNamee</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{Date.now().toLocaleString()}</td>
                                            <td>GRH</td>
                                            <td>07:30 - 10:30</td>
                                            <td>@INFO L3</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="d-flex align-items-center">
                                    <h5 className="card-title">Prochain examen: [JAVA IHM - {Date.now()}] (30 etudiants inscrits)</h5>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <div className="col-md-12">
                                        <div className="card card-round">

                                            <div className="card-body p-0">
                                                <div className="table-responsive">

                                                    <table className="table align-items-center mb-0">
                                                        <thead className="thead-light">
                                                            <tr>
                                                                {/* <th scope="col">Numero de paiement</th> */}
                                                                <th scope="col" className="text-start">MATRICULE</th>
                                                                <th scope="col" className="text-start">NOM & PRENOM</th>
                                                                <th scope="col" className="text-start">MENTION</th>
                                                                <th scope="col" className="text-start">NIVEAU</th>

                                                            </tr>
                                                        </thead>
                                                        <tbody className=''>
                                                            <tr>
                                                                <td>E1151</td>
                                                                <td>FENONANTENAIKO Lovasoa Gilbert Juliannot</td>
                                                                <td>INFO</td>
                                                                <td>L3</td>
                                                            </tr>
                                                            <tr>
                                                                <td>E1151</td>
                                                                <td>FENONANTENAIKO Lovasoa Gilbert Juliannot</td>
                                                                <td>INFO</td>
                                                                <td>L3</td>
                                                            </tr>
                                                            <tr>
                                                                <td>E1151</td>
                                                                <td>FENONANTENAIKO Lovasoa Gilbert Juliannot</td>
                                                                <td>INFO</td>
                                                                <td>L3</td>
                                                            </tr>
                                                            <tr>
                                                                <td>E1151</td>
                                                                <td>FENONANTENAIKO Lovasoa Gilbert Juliannot</td>
                                                                <td>INFO</td>
                                                                <td>L3</td>
                                                            </tr>
                                                            <tr>
                                                                <td>E1151</td>
                                                                <td>FENONANTENAIKO Lovasoa Gilbert Juliannot</td>
                                                                <td>INFO</td>
                                                                <td>L3</td>
                                                            </tr>
                                                            <tr>
                                                                <td>E1151</td>
                                                                <td>FENONANTENAIKO Lovasoa Gilbert Juliannot</td>
                                                                <td>INFO</td>
                                                                <td>L3</td>
                                                            </tr>
                                                            <tr>
                                                                <td>E1151</td>
                                                                <td>FENONANTENAIKO Lovasoa Gilbert Juliannot</td>
                                                                <td>INFO</td>
                                                                <td>L3</td>
                                                            </tr>
                                                            <tr>
                                                                <td>E1151</td>
                                                                <td>FENONANTENAIKO Lovasoa Gilbert Juliannot</td>
                                                                <td>INFO</td>
                                                                <td>L3</td>
                                                            </tr>
                                                            <tr>
                                                                <td>E1151</td>
                                                                <td>FENONANTENAIKO Lovasoa Gilbert Juliannot</td>
                                                                <td>INFO</td>
                                                                <td>L3</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

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