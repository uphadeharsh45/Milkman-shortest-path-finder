import React, { useEffect, useState } from 'react';
import { GoogleMap, DirectionsService } from '@react-google-maps/api';


class PriorityQueue {
    constructor() {
        this.queue = [];
    }

    enqueue(index, duration, distance, deadline, parent) {
        const item = { index, duration, distance, deadline, parent };
        let added = false;
        for (let i = 0; i < this.queue.length; i++) {
            if (deadline < this.queue[i].deadline) {
                this.queue.splice(i - 1, 0, item);
                added = true;
                break;
            }
            else if (duration < this.queue[i].duration) {
                this.queue.splice(i, 0, item);
                added = true;
                break;
            }
            else if (distance < this.queue[i].distance) {
                this.queue.splice(i, 0, item);
                added = true;
                break;
            }
        }
        if (!added) {
            this.queue.push(item);
        }
    }

    dequeue() {
        return this.queue.shift();
    }

    peek() {
        return this.queue[0];
    }

    isEmpty() {
        return this.queue.length === 0;
    }

    size() {
        return this.queue.length;
    }

    print() {
        console.log(this.queue.map((item) => `${item.element} - ${item.priority}`).join('\n'));
    }
}

// Example usage
/*const pq = new PriorityQueue();
pq.enqueue('A', 2);
pq.enqueue('B', 1);
pq.enqueue('C', 3);
pq.print();*/
// Output:
// B - 1
// A - 2
// C - 3

/*console.log('Dequeued:', pq.dequeue());
pq.print();*/
// Output:
// A - 2
// C - 3
let final=[];

function main(location, data, deadline) {

    const pq = new PriorityQueue();

    pq.enqueue(0, 0, 0, 0, 0);

    let vis = new Array(location.length);
    vis[0] = -1;
    for (let i = 1; i < vis.length; i++) {
        vis[i] = 0;
    }

    let curTime = 0;

    let order = new Array();

    let notVis = new Array();

    while (!pq.isEmpty()) {
        let curStop = pq.peek();
        pq.dequeue();
        if (vis[curStop.index] > 0 || vis[curStop.parent] == 2) {
            continue;
        }
        if (curTime + curStop.duration > deadline[curStop.index]) {
            notVis.push(curStop.index);
            continue;
        }
        curTime = curTime + curStop.duration;
        vis[curStop.index] += 1;
        vis[curStop.parent] += 1;
        order.push(curStop.index);
        for (let i = 0; i < location.length; i++) {
            if (i != curStop.index && !vis[i]) {
                pq.enqueue(i, data[curStop.index][i][0], data[curStop.index][i][1], deadline[i], curStop.index);
            }
        }
    }

    for (let i = 0; i < notVis.length; i++) {
        order.push(notVis[i]);
    }

    for (let i = 0; i < order.length; i++) {
        console.log(location[order[i]]);
        console.log(deadline[order[i]]);
        final.push(location[order[i]]);
    }
}

function DistanceMatrix({ locations, setOptimizedLocations }) {
    const [distances, setDistances] = useState(null);
    const [loc, setLoc] = useState([]);

    useEffect(() => {
        if (locations.location.length === 0) return;

        let dataArr = new Array(locations.location.length);

        for (let i = 0; i < dataArr.length; i++) {
            dataArr[i] = new Array(locations.location.length);
            for (let j = 0; j < locations.location.length; j++) {
                dataArr[i][j] = new Array(2);
            }
        }

        let deadlines = locations.deadline

        const origins = locations.location.map((loc) => ({ lat: loc.lat, lng: loc.lng }));
        //const destinations = origins.slice(); // Copy the array of origins

        const service = new window.google.maps.DistanceMatrixService();

        for (let i = 0; i < origins.length; i++) {
            for (let j = i + 1; j < origins.length; j++) {

                if (i == j) {
                    dataArr[i][j][0] = 0;
                    dataArr[i][j][1] = 0;
                }
                else {
                    service.getDistanceMatrix(
                        {
                            origins: [origins[i]],
                            destinations: [origins[j]],
                            travelMode: 'DRIVING', // Change this if you need other modes
                        },
                        (response, status) => {
                            if (status === 'OK') {
                                //setDistances(response);
                                //console.log(response);
                                let tStr = response.rows[0].elements[0].duration.text.split(" ");
                                let dStr = response.rows[0].elements[0].distance.text.split(" ");
                                let duration = 0;
                                let distance = 0;
                                for (let k = 0; k < tStr.length - 1; k++) {
                                    if (tStr[k + 1] == "hours" || tStr[k + 1] == "hour") {
                                        duration = duration + parseInt(tStr[i])
                                    }
                                    else if (tStr[i + 1] == "mins" || tStr[i + 1] == "min") {
                                        duration = duration + (parseInt(tStr[i]) / 60)
                                    }
                                    else if (tStr[i + 1] == "secs" || tStr[i + 1] == "sec") {
                                        duration = duration + (parseInt(tStr[i]) / 3600)
                                    }
                                }
                                for (let k = 0; k < dStr.length - 1; k++) {
                                    if (dStr[k + 1] == "km") {
                                        distance = distance + parseInt(dStr[i])
                                    }
                                    else if (dStr[i + 1] == "m") {
                                        distance = distance + (parseInt(dStr[i]) / 1000)
                                    }
                                    else if (dStr[i + 1] == "cm") {
                                        distance = distance + (parseInt(dStr[i]) / 1000000)
                                    }
                                }
                                dataArr[i][j][0] = duration;
                                dataArr[i][j][1] = distance;
                                dataArr[j][i][0] = duration;
                                dataArr[j][i][1] = distance;
                            } else {
                                console.error('Error:', status);
                            }
                        }
                    );
                }
            }
        }

        
         main(locations.location, dataArr, deadlines);
         setOptimizedLocations(final);
        //  const newarr=final.slice(0, Math.ceil(final.length / 2));

        //  setOptimizedLocations(newarr);
    // Set the optimized locations using the provided callback function
    // setOptimizedLocations(locations);
    }, [locations]);

    // useEffect(() => {
    //     // Set optimizedLocations to half the length of the final array
    //     setOptimizedLocations(final.slice(0, Math.ceil(final.length / 2)));
    // }, [final, setOptimizedLocations]);
// console.log(loc)
// console.log(final);

return null
    // return (
    //     // <div>
    //     //     {/* {distances && distances.rows.map((row, i) => (
    //     //         <div key={i}>
    //     //             {row.elements.map((element, j) => (
    //     //                 <div key={j}>
    //     //                     Distance from {locations.location[i].name} to {locations.location[j].name}: {element.distance.text}, Duration: {element.duration.text}
    //     //                 </div>
    //     //             ))}
    //     //         </div>
    //     //     ))} */}
    //     // </div>
    // );
}

export default DistanceMatrix;
