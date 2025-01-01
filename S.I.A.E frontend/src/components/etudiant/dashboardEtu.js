
import { useEffect, useState } from "react";
import LineChart from "../../chart/lineChart";
import "bootstrap-notify"
// import $ from "jquery"
import swal from "sweetalert";

import { Sparklines, SparklinesLine, SparklinesBars, SparklinesSpots } from "react-sparklines";
import axios from "axios";


const Dashboard = () => {

    const getCurrentDateTime = () => {
        const current = new Date();
        const year = current.getFullYear();
        const month = String(current.getMonth() + 1).padStart(2, '0'); // Ajout de 1 car les mois commencent à 0
        const day = String(current.getDate()).padStart(2, '0');
        const hours = String(current.getHours()).padStart(2, '0');
        const minutes = String(current.getMinutes()).padStart(2, '0');

        return `${year}/${month}/${day} ${hours}:${minutes}`;
    };

    const currentDateTime = getCurrentDateTime();
    const nitifications = [
        {
            id: 1,
            nom: "Institut de Formation Technique",
            titre: "Convocation aux examens",
            motif: "Vous etes convoques d'assister aux examens ecrits qui se deroulera la semaine de ....",
            date: "2024/20/11 10:45",
            statut: "non lu"
        },
        {
            id: 2,
            nom: "Systeme",
            titre: "Avertissement de retard de paiement de frais de formation et droit d'examen",
            motif: "Lorem sdfjkfsdjfdnv,msdnkjnsdfmsfdmnsbndvkjsd  sjfbksdjbfjksndfnsdvkhjbsdkjfsdm,  sjfdjsdnf,msdn,jnsd jnsdjknfsd.nf.knsbklfhjsd ksdjhkfbsjdknfsmfns!",
            date: currentDateTime,
            statut: "lu"
        },
        {
            id: 3,
            nom: "Systeme",
            titre: "Avertissement de retard de paiement de frais de formation et droit d'examen",
            motif: "Lorem sdfjkfsdjfdnv,msdnkjnsdfmsfdmnsbndvkjsd  sjfbksdjbfjksndfnsdvkhjbsdkjfsdm,  sjfdjsdnf,msdn,jnsd jnsdjknfsd.nf.knsbklfhjsd ksdjhkfbsjdknfsmfns!",
            date: currentDateTime,
            statut: "non lu"
        },
        // {
        //     id: 4,
        //     nom: "Systeme",
        //     titre: "Avertissement de retard de paiement de frais de formation et droit d'examen",
        //     motif: "Lorem sdfjkfsdjfdnv,msdnkjnsdfmsfdmnsbndvkjsd  sjfbksdjbfjksndfnsdvkhjbsdkjfsdm,  sjfdjsdnf,msdn,jnsd jnsdjknfsd.nf.knsbklfhjsd ksdjhkfbsjdknfsmfns!",
        //     date: currentDateTime,
        //     statut: "lu"
        // },
        // {
        //     id: 5,
        //     nom: "Systeme",
        //     titre: "Avertissement de retard de paiement de frais de formation et droit d'examen",
        //     motif: "Lorem sdfjkfsdjfdnv,msdnkjnsdfmsfdmnsbndvkjsd  sjfbksdjbfjksndfnsdvkhjbsdkjfsdm,  sjfdjsdnf,msdn,jnsd jnsdjknfsd.nf.knsbklfhjsd ksdjhkfbsjdknfsmfns!",
        //     date: currentDateTime,
        //     statut: "lu"
        // },

    ];

    const mesExam = [
        {
            id: 1, session: "EXAM.S5", matiere: "JAVA", dateExam: currentDateTime, debut: "08:30", fin: "12:00", statut: "En cours", duree: "3H 30"
        },
        {
            id: 2, session: "EXAM.S5", matiere: "C++", dateExam: currentDateTime, debut: "07:30", fin: "9:30", statut: "En cours", duree: "3H"
        },
        {
            id: 3, session: "EXAM.S5", matiere: "Python", dateExam: currentDateTime, debut: "08:30", fin: "12:00", statut: "En cours", duree: "3H"
        },
        {
            id: 4, session: "EXAM.S5", matiere: "MCP", dateExam: currentDateTime, debut: "08:30", fin: "12:00", statut: "En cours", duree: "3H"
        },
        {
            id: 5, session: "EXAM.S5", matiere: "RO", dateExam: currentDateTime, debut: "08:30", fin: "12:00", statut: "En cours", duree: "3H"
        },
    ];

    const [exam, setExam] = useState(mesExam);

    const getColorForLetter = (letter) => {
        const firstLetter = letter.toUpperCase();
        if ("AHOU".includes(firstLetter)) { return 'blue'; }
        else if ("BIPV".includes(firstLetter)) { return 'red'; }
        else if ("CJQW".includes(firstLetter)) { return 'green'; }
        else if ("DKRX".includes(firstLetter)) { return 'purple'; }
        else if ("ELSY".includes(firstLetter)) { return 'orange'; }
        else if ("FMTZ".includes(firstLetter)) { return 'pink'; }
        else if ("GN".includes(firstLetter)) { return 'yellow'; }
        else {
            return 'black';
        }
    }

    const [notifyData, setNotifyData] = useState(nitifications);


    const showNotificationDetails = (notification) => {
        swal({
            title: notification.nom,
            text: `${notification.titre}\n\n\n Objet\n
            ${notification.motif}
            \n\n${notification.date}`,

            buttons: {
                confirm: {
                    text: "Fermer",
                    value: true,
                    visible: true,
                    className: "btn btn-primary",
                    closeModal: true
                }
            }
        });
    };

    useEffect(() => {
        // getCountStudent();
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
                    {/* <div>
                        <h3 className="fw-bold mb-3">Tableau de bord</h3>
                    </div> */}

                </div>

                <div className="row">
                    <div className="col-md-4">
                        <div className="card card-secondary bg-secondary-gradient">
                            <div className="card-body skew-shadow">
                                <img
                                    src="/assets/img/hourglass.png"
                                    height="12.5"
                                    alt=""
                                />
                                <h2 className="py-4 mb-0">Examens En cours</h2>
                                <div className="row">
                                    <div className="col-8 pe-0">
                                        <h3 className="fw-bold mb-1">Semaine du</h3>
                                        <div className="text-md text-uppercase fw-bold op-8">
                                            28/12/2024
                                        </div>
                                    </div>
                                    <div className="col-4 ps-0 text-end">
                                        <h3 className="fw-bold mb-1">4/26</h3>
                                        <div className="text-md text-uppercase fw-bold op-8">
                                            Total
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card card-secondary bg-secondary-gradient">
                            <div className="card-body bubble-shadow">
                                <img
                                    src="/assets/img/apparaisal.png"
                                    height="12.5"
                                    alt=""
                                />
                                <h2 className="py-4 mb-0">Inscriptions</h2>
                                <div className="row">
                                    <div className="col-8 pe-0">
                                        <h3 className="fw-bold mb-1"></h3>
                                        <div className="text-md text-uppercase fw-bold op-8">
                                            {/* Card Holder */}
                                        </div>
                                    </div>
                                    <div className="col-4 ps-0 text-end">
                                        <h3 className="fw-bold mb-1">4/26</h3>
                                        <div className="text-md text-uppercase fw-bold op-8">
                                            Valide
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card card-secondary bg-secondary-gradient">
                            <div className="card-body curves-shadow">
                                <img
                                    src="/assets/img/session.png"
                                    height="15"
                                    alt=""
                                />
                                <h2 className="py-4 mb-0">Sceance Suivante</h2>
                                <div className="row">
                                    <div className="col-8 pe-0">
                                        <h3 className="fw-bold mb-1">Dans</h3>
                                        <div className="text-md text-uppercase fw-bold op-8">
                                            5 Jours
                                        </div>
                                    </div>
                                    {/* <div className="col-4 ps-0 text-end">
                                        <h3 className="fw-bold mb-1">4/26</h3>
                                        <div className="text-small text-uppercase fw-bold op-8">
                                            Total
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6" >
                        <div className="card card-round">
                            <div className="card-header">
                                <div className="card-head-row">
                                    <div className="card-title">Recentes notifications</div>
                                </div>
                            </div>


                            <div className="card-body" style={{ height: '450px' }}>

                                {
                                    notifyData.map((not, index) => (

                                        <div key={index} data-key={not.id} className={not.statut === "non lu" ? "fw-bold" : ""}>
                                            <div className="d-flex">
                                                <div className="avatar avatar-online">
                                                    <span
                                                        className="avatar-title rounded-circle border border-white"
                                                        style={{ backgroundColor: getColorForLetter(not.nom.charAt(0)) }}
                                                    >{not.nom.charAt(0)}</span>
                                                </div>
                                                <div className="flex-1 ms-3 pt-1">
                                                    <h6 className="text-uppercase fw-bold mb-1">
                                                        {not.nom}
                                                        <span className={not.statut === "non lu" ? "text-warning ps-3" : "text-success ps-3"}>{not.statut}</span>
                                                    </h6>
                                                    <span className="text-muted ">
                                                        {not.titre}
                                                    </span>

                                                    <div className='float-end pt-1'>
                                                        <i className='fa fa-eye' onClick={() => showNotificationDetails(not)} style={{ cursor: 'pointer', fontSize: '20px' }}></i>
                                                    </div>

                                                </div>

                                                <div className="float-end pt-1">
                                                    <span className="text-muted">{not.date}</span>
                                                </div>
                                            </div>
                                            <div className="separator-dashed"></div>
                                        </div>
                                    )
                                    )
                                }

                            </div>


                        </div>
                    </div>


                    <div className="col-md-6">
                        <div className="card card-round">
                            <div className="card-header">
                                <div className="card-head-row">
                                    <div className="card-title">Prochaines examens en cours</div>
                                </div>
                            </div>


                            <div className="card-body" style={{ height: '450px' }}>
                                <div className="table-responsive">

                                    <table className="table table-bordered table-head-bg-success  mt-0">
                                        <thead>
                                            <tr className='text-center fw-bold'>
                                                <th scope='col'>SESSION</th>
                                                <th scope="col">DATE</th>
                                                <th scope="col">MATIERE</th>
                                                <th scope="col">HORAIRE</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                exam.map((ex, index) => (
                                                    <tr key={index} data-key={ex.id} className="text-center">
                                                        <td>{ex.session}</td>
                                                        <td>{ex.dateExam}</td>
                                                        <td>{ex.matiere}</td>
                                                        <td>{ex.debut} - {ex.fin}</td>
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
    )
}

export default Dashboard;