import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';


ChartJS.register(CategoryScale, ArcElement, Title, Tooltip, Legend);


const PieChart = () => {
    const data = {
        labels: ["Red", "Blue", "Yellow"],
        datasets: [
            {
                data: [300, 50, 100],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            },
        ],
    };

    return <Pie data={data} />;
};

export default PieChart;
