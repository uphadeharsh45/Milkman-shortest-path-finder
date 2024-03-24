
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
                this.queue.splice(i - 1, 0, item);
                added = true;
                break;
            }
            else if (distance < this.queue[i].distance) {
                this.queue.splice(i - 1, 0, item);
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
        // console.log(this.queue.map((item) => ${item.element} - ${item.priority}).join('\n'));
    }
}

let final=[];
async function main(location, data, deadline) {

    //console.log(data)
    //console.log(4);

    //console.log(data[0][1], data[0][1][0], data[0][1][1]);

    const pq = new PriorityQueue();

    pq.enqueue(0, 0, 0, 0, 0);

    let vis = new Array(location.length);
    vis[0] = -1;
    for (let i = 1; i < vis.length; i++) {
        vis[i] = 0;
    }

    let curTime = 0;

    let order = [];

    let notVis = [];

    while (!pq.isEmpty()) {
        let curStop = pq.peek();
        pq.dequeue();
        if (vis[curStop.index] > 0 || vis[curStop.parent] === 2) {
            continue;
        }
        if (curTime + curStop.duration > deadline[curStop.index]) {
            notVis.push(curStop.index);
            continue;
        }
        curTime = curTime + curStop.duration;
        vis[curStop.index] += 1;
        vis[curStop.parent] += 1;
        //console.log(curStop.index);
        order.push(curStop.index);
        for (let i = 0; i < location.length; i++) {
            if (i !== curStop.index && !vis[i]) {
                pq.enqueue(i, data[curStop.index][i][0], data[curStop.index][i][1], deadline[i], curStop.index);
            }
        }
    }

    //console.log(notVis.length);

    for (let i = 0; i < notVis.length; i++) {
        if (vis[notVis[i]] == 0) {
            order.push(notVis[i]);
            vis[notVis[i]] += 1;
        }
    }

    console.log(order);

    for (let i = 0; i < order.length; i++) {
        console.log(location[order[i]]);
        console.log(deadline[order[i]]);
        console.log(data[0][order[i]][0]);
        final.push(location[order[i]]);
    }
}

function DistanceMatrix({ locations, setOptimizedLocations }) {
    const [distances, setDistances] = useState(null);

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

        const f3 = (i, j) => {
            return new Promise((resolve, reject) => {
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
                            //console.log(tStr, dStr)
                            let duration = 0;
                            let distance = 0;
                            for (let k = 0; k < tStr.length - 1; k++) {
                                if (tStr[k + 1] === "hours" || tStr[k + 1] === "hour") {
                                    duration = duration + parseFloat(tStr[k])
                                }
                                else if (tStr[k + 1] === "mins" || tStr[k + 1] === "min") {
                                    duration = duration + (parseFloat(tStr[k]) / 60)
                                }
                                else if (tStr[k + 1] === "secs" || tStr[k + 1] === "sec") {
                                    duration = duration + (parseFloat(tStr[k]) / 3600)
                                }
                            }
                            for (let k = 0; k < dStr.length - 1; k++) {
                                if (dStr[k + 1] === "km") {
                                    distance = distance + parseFloat(dStr[k])
                                }
                                else if (dStr[k + 1] === "m") {
                                    distance = distance + (parseFloat(dStr[k]) / 1000)
                                }
                                else if (dStr[k + 1] === "cm") {
                                    distance = distance + (parseFloat(dStr[k]) / 1000000)
                                }
                            }
                            //console.log(1);
                            resolve([duration, distance]);
                            /*dataArr[i][j][0] = duration;
                            dataArr[i][j][1] = distance;
                            dataArr[j][i][0] = duration;
                            dataArr[j][i][1] = distance;*/
                            //console.log(dataArr[i][j][0], dataArr[i][j][1], dataArr[j][i][0], dataArr[j][i][1]);
                        } else {
                            console.error('Error:', status);
                        }
                    }
                );
            })
        }

        const f2 = () => {
            return new Promise(async (resolve, reject) => {
                for (let i = 0; i < origins.length; i++) {
                    for (let j = i + 1; j < origins.length; j++) {

                        if (i === j) {
                            dataArr[i][j][0] = 0;
                            dataArr[i][j][1] = 0;
                        }
                        else {
                            const m = await f3(i, j);
                            dataArr[i][j][0] = m[0];
                            dataArr[i][j][1] = m[1];
                            dataArr[j][i][0] = m[0];
                            dataArr[j][i][1] = m[1];
                            //console.log(2);
                        }
                    }
                }
                resolve();
            })
        }

        const f1 = async () => {
            await f2();
            //iconsole.log(3)
            //console.log(dataArr[0][1], dataArr[0][1][0], dataArr[0][1][1]);
           await main(locations.location, dataArr, deadlines);
            setOptimizedLocations(final);
        }

        f1();

       
    }, [locations]);

    return null;
    // return (
    //     <div>
    //         {distances && distances.rows.map((row, i) => (
    //             <div key={i}>
    //                 {row.elements.map((element, j) => (
    //                     <div key={j}>
    //                         Distance from {locations.location[i].name} to {locations.location[j].name}: {element.distance.text}, Duration: {element.duration.text}
    //                     </div>
    //                 ))}
    //             </div>
    //         ))}
    //     </div>
    // );
}

export default DistanceMatrix;