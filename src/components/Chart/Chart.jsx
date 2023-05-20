import { Bar } from 'react-chartjs';

const BOOKING_BUCKETS = {
    cheap: {
        min: 0,
        max: 200
    },
    normal: {
        min: 201,
        max: 600
    },
    expensive: {
        min: 601,
        max: 1000000000
    }
};

function Chart({ bookings }) {
    let countValues = [];
    let labels = [];
    let count;
    for(const category in BOOKING_BUCKETS) {
        labels.push(category);
        count = bookings.reduce((prev, current) => {
            if(current.event.price >= BOOKING_BUCKETS[category].min && current.event.price <= BOOKING_BUCKETS[category].max) {
                return prev + 1;
            } else {
                return prev;
            }
        }, 0);
        countValues.push(count);
    }
    const data = {
        labels: labels,
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(220,220,220,0.5)",
                strokeColor: "rgba(220,220,220,0.8)",
                highlightFill: "rgba(220,220,220,0.75)",
                highlightStroke: "rgba(220,220,220,1)",
                data: countValues
            }
        ]
    };
    return (
        <div className='ml-4'>
            <Bar data={data}/>
        </div>
    );
}

export default Chart