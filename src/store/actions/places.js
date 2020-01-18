import {REMOVE_PLACE, SET_PLACES, PLACE_ADDED, START_ADD_PLACE} from './actionTypes';
import {uiStartLoading, uiStopLoading, authGetToken} from './index';
export const startAddPlace = () => {
    return{
        type: START_ADD_PLACE
    };
};
export const addPlace = (placeName, location, image) => {
    return dispatch => {
        let authToken;
        dispatch(uiStartLoading());
        dispatch(authGetToken())
            .catch(() => {
                alert("No valid token found!");
            })
            .then(token => {
                authToken = token;
                return fetch("https://us-central1-awesomeplaces-7f4b0.cloudfunctions.net/storeImage", {
                    method: "POST",
                    body: JSON.stringify({
                        image: image.base64
                    }),
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            })
            .then(res => {
                if(res.ok){
                    return res.json();
                } else{
                    throw(new Error());
                }
            })
            .then(parsedRes => {
                const placeData = {
                    name: placeName,
                    location: location,
                    image: parsedRes.imageUrl,
                    imagePath: parsedRes.imagePath
                };
                return fetch("https://awesomeplaces-7f4b0.firebaseio.com/places.json?auth=" + authToken, {
                    method: "POST",
                    body: JSON.stringify(placeData)
                })
                    .then(res => {
                        if(res.ok){
                            return res.json();
                        } else{
                            throw(new Error());
                        }
                    })
                    .then(parsedRes => {
                        console.log(parsedRes);
                        dispatch(uiStopLoading());
                        dispatch(placeAdded());
                })
                .catch(err => {
                        console.log(err);
                        alert("Something went, please try again!");
                        dispatch(uiStopLoading());
                });
        })
        .catch(err => {
                console.log(err);
                alert("Something went wrong, please try again!");
                dispatch(uiStopLoading());
        });
    };
};
export const placeAdded = () => {
    return{
        type: PLACE_ADDED
    };
};
export const setPlaces = places => {
    return{
        type: SET_PLACES,
        places: places
    };
};
export const getPlaces = () => {
    return dispatch => {
        dispatch(authGetToken())
            .then(token => {
                return fetch("https://awesomeplaces-7f4b0.firebaseio.com/places.json?auth=" + token)
            })
            .catch(() => {
                alert("No valid token found!");
            })
            .then(res => {
                if(res.ok){
                    return res.json();
                } else{
                    throw(new Error());
                }
            })
            .then(parsedRes => {
                const places = [];
                for (let key in parsedRes) {
                    places.push({
                        ...parsedRes[key],
                        image: {
                            uri: parsedRes[key].image
                        },
                        key: key
                    });
                }
                dispatch(setPlaces(places));
            })
            .catch(err => {
                alert("Something went wrong, sorry :/");
                console.log(err);
            });
    };
};
export const removePlace = key => {
    return {
        type: REMOVE_PLACE,
        key: key
    };
};
export const deletePlace = (key) => {
    return dispatch => {
        dispatch(authGetToken())
            .catch(() => {
                alert("No valid token found!");
            })
            .then(token => {
                dispatch(removePlace(key));
                return fetch("https://awesomeplaces-7f4b0.firebaseio.com/places/" + key + ".json?auth=" + token, {
                    method: "DELETE"
                })
            })
            .then(res => {
                if(res.ok){
                    return res.json();
                } else{
                    throw(new Error());
                }
            })
            .then(parsedRes => {
                console.log("Done!");
            })
            .catch(err => {
                alert("Something went wrong, sorry :/");
                console.log(err);
            });
    };
};