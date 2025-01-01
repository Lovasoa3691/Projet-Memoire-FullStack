import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
// import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

function HistoriqueContent() {


    const [search, setSearch] = useState("");
    const [filtre, setFiltre] = useState([]);
    const [EtuData, setEtuData] = useState([]);



    useEffect(() => {
        // chargerEtudiants();
        // console.log(JSON.stringify(EtuData))
    }, []);

    // useEffect(() => {
    //     const filtrer = EtuData.filter(item =>
    //         item.MATRICULE.toLowerCase().includes(search.toLowerCase()) ||
    //         item.NOM.toLowerCase().includes(search.toLowerCase()) ||
    //         item.PRENOM.toLowerCase().includes(search.toLowerCase()) ||
    //         item.MENTION.toLowerCase().includes(search.toLowerCase()) ||
    //         item.NIVEAU.toLowerCase().includes(search.toLowerCase())
    //     );

    //     setFiltre(filtrer);
    // }, [search, EtuData]);

    const chargerEtudiants = () => {

        axios.get('http://localhost:5000/api/etudiants')
            .then((rep) => {
                // console.log(rep.data);
                setEtuData(rep.data);
                setFiltre(rep.data);
            })
            .catch(error => {
                console.log("Erreur lors de la recuperation des donnees: ", error);
            })
    };

    return (
        <div className="container">

            <div className="page-inner">
                <div className="page-header">
                    <h3 className="fw-bold mb-3">Historiques des inscriptions</h3>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="card-head-row card-tools-still-right">
                                    <div className="card-title">Historiques de mes incriptions</div>

                                </div>
                            </div>
                            <div className="card-body">
                                <ol className="activity-feed">
                                    <li className="feed-item feed-item-success mb-4">
                                        <time className="date" >25 Dec 2024 11:54</time>
                                        <span className="text fw-bold text-md"
                                        >Inscription a l'examen &nbsp;&nbsp;
                                            <a className='text-primary'>"JAVA IHM"</a> &nbsp;&nbsp;de la session &nbsp;&nbsp; <a className='text-primary'>EXAM.S5</a></span
                                        >
                                        <div className='float-end pt-1'>
                                            <i className='fa fa-times text-danger' style={{ cursor: 'pointer', fontSize: '20px' }}></i>
                                        </div>
                                    </li>
                                    <li className="feed-item feed-item-success mb-4">
                                        <time className="date" >25 Dec 2024 11:54</time>
                                        <span className="text fw-bold text-md"
                                        >Inscription a l'examen &nbsp;&nbsp;
                                            <a className='text-primary'>"JAVA IHM"</a> &nbsp;&nbsp;de la session &nbsp;&nbsp; <a className='text-primary'>EXAM.S5</a></span
                                        >
                                        <div className='float-end pt-1'>
                                            <i className='fa fa-times text-danger' style={{ cursor: 'pointer', fontSize: '20px' }}></i>
                                        </div>
                                    </li>

                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default HistoriqueContent;