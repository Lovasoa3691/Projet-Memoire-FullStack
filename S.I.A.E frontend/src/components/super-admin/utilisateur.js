import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
// import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import api from '../API/api';
import swal from 'sweetalert';

function UtilisateurContent() {

    const colonne = [
        // {
        //     name: "_ID",
        //     selector: row => row._id,
        //     sortable: true,
        // },
        // {
        //     name: "_ID",
        //     selector: row => row.ID_EXAM,
        //     sortable: true,
        // },
        {
            name: "NOM UTILISATEUR",
            selector: row => row.nom_ut,
            sortable: true,
        },
        {
            name: "EMAIL",
            selector: row => row.email,
            sortable: true,
        },
        {
            name: "ROLE",
            selector: row => row.role,
            sortable: true,
        },

    ];


    const [search, setSearch] = useState("");
    const [filtre, setFiltre] = useState([]);
    const [utilisateurData, setutilisateurData] = useState([]);

    const getColorForLetter = (letter) => {
        const firstLetter = letter.toUpperCase();
        if ("ABCD".includes(firstLetter)) { return 'blue'; }
        else if ("EFGH".includes(firstLetter)) { return 'red'; }
        else if ("IJKL".includes(firstLetter)) { return 'green'; }
        else if ("MNOP".includes(firstLetter)) { return 'purple'; }
        else if ("QRST".includes(firstLetter)) { return 'orange'; }
        else if ("UVWX".includes(firstLetter)) { return 'pink'; }
        else if ("YZ".includes(firstLetter)) { return 'yellow'; }
        else {
            return 'black';
        }
    }

    useEffect(() => {
        chargerUtilisateurs();
    }, []);


    const chargerUtilisateurs = () => {
        api.get('/utilisateur/all')
            .then((rep) => {
                // console.log(rep.data);
                setutilisateurData(rep.data.users);
                setFiltre(rep.data.users);
            })
            .catch(error => {
                console.log("Erreur lors de la recuperation des donnees: ", error);
            })
    };


    return (
        <div className="container">

            <div className="page-inner">
                <div className="page-header">
                    <h3 className="fw-bold mb-3">Liste des utilisateurs</h3>
                </div>


                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="d-flex align-items-center">
                                    {/* <h4 className="card-title">Add Row</h4> */}
                                    {/* <button
                                        className="btn btn-primary btn-round ms-auto"
                                        data-bs-toggle="modal"
                                        data-bs-target="#addRowModal"
                                    >
                                        <i className="fa fa-plus"></i>
                                        Creer Session
                                    </button> */}
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
                                                                <th scope="col" className="text-start">NOM UTILISATEUR</th>
                                                                <th scope="col" className="text-start">EMAIL</th>
                                                                <th scope="col" className="text-start">ROLE</th>
                                                                <th scope="col" className="text-start">STATUT</th>
                                                                <th scope="col" className="text-center">ACTIONS</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className='fw-bold'>

                                                            {
                                                                utilisateurData && utilisateurData.map(item => (
                                                                    <tr key={item._id}>

                                                                        <td className="text-start d-flex align-items-center">
                                                                            <div className={item.statut_ut === "Online" ? "avatar avatar-online" : item.statut_ut === "Offline" ? "avatar avatar-offline" : "avatar avatar-away"}>
                                                                                <span
                                                                                    className="avatar-title rounded-circle border border-white"
                                                                                    style={{ backgroundColor: getColorForLetter(item.nom_ut.charAt(0)) }}
                                                                                >{item.nom_ut.charAt(0)}</span>
                                                                            </div> &nbsp;&nbsp;
                                                                            <div>
                                                                                {item.nom_ut}
                                                                            </div>

                                                                        </td>

                                                                        <td className="text-start">{item.email}</td>
                                                                        <td className="text-start">
                                                                            {item.role}
                                                                        </td>
                                                                        <td className="text-start">
                                                                            {item.statut_ut}
                                                                        </td>

                                                                    </tr>
                                                                ))
                                                            }

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
    );
}

export default UtilisateurContent;