const options = {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    }
};

var profileDataForUser;
fetch("/profileData", options)
    .then(res => {
        profileDataForUser = res.json();
        console.log(profileDataForUser);
    })
    .catch(err => {alert(err)});
