import React from 'react';
import { useState } from 'react';
import swal from 'sweetalert';


function NotificationContent() {



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
            statut: "non lu"
        },

    ];

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

    const deleteNotification = () => {
        swal({
            title: "Etes-vous sur?",
            text: "Une fois supprime, vous ne pourrez plus recuperer ce fichier !",
            icon: "warning",
            buttons: {
                confirm: {
                    text: "Oui",
                    className: "btn btn-success",
                },
                cancel: {
                    text: "Non",
                    visible: true,
                    className: "btn btn-danger"
                }
            },
            // dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                swal("Poof! Votre donnee a ate supprime!", {
                    icon: "success",
                    buttons: {
                        confirm: {
                            className: "btn btn-success",
                        },
                    },
                });
            } else {
                swal.close();
            }
        });
    }



    return (
        <div className="container">
            <div className="page-inner">
                <div className="page-header">
                    <h3 className="fw-bold mb-3">Tous mes notifications</h3>
                </div>
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="card-head-row">
                                <div className="card-title">Notifications</div>

                            </div>
                        </div>
                        <div className="card-body">

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
                                                    <i className='fa fa-eye' onClick={() => showNotificationDetails(not)} style={{ cursor: 'pointer', fontSize: '20px' }}></i>&nbsp;&nbsp;
                                                    <i className='fa fa-trash-alt text-danger' onClick={deleteNotification} style={{ cursor: 'pointer', fontSize: '20px' }}></i>
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
            </div>

        </div >
    );
}

export default NotificationContent;