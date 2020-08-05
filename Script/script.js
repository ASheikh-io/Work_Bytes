$(document).ready(function () {
  let lat;
  let lon;
  const jobListings = $("div.job-listings");
  const restaurantListings = $("div.restaurant-listings");
  const jobLocationCity = $("input#job-location-city");
  const jobLocationState = $("input#job-location-state");
  const jobLocationCountry = $("input#job-location-country");

  let savedJobsArr = [];

  const apiKey =
    "08b0f7f65564475254bb83cd500444bd4cbc421bdbe6f0dc120b7552e822dc21";

  function findJobs(locationInputCity, locationInputState) {
    // jobs ajax request
    $.ajax({
      url: `https://www.themuse.com/api/public/jobs?location=${locationInputCity}%2C%20${locationInputState}&page=1&descending=true&api_key=${apiKey}`,
      //   Request URL: https://www.themuse.com/api/public/jobs?location=Aachen%2C%20Germany&page=10&descending=true
      method: "GET",
    }).then(function (response) {
      // console.log(response);
      jobListings.empty();
      for (let i = 0; i < 10; i++) {
        let newDiv = $("<div class='input-field new-div-style'></div>")
          .attr("data-name", response.results[i].company.name)
          .attr("data-location", response.results[i].locations[0].name)
          .addClass("jobListingClick");
        jobListings.append(newDiv);
        newDiv
          .append(`<h4>${response.results[i].name}</h4>`)
          .append(`<p>${response.results[i].company.name}</p>`)
          // needs to truncate // extract to .val()?
          //   .append(`<p>${response.results[i].contents}<p>`)
          // limit to 2 characters
          .append(`<p>${response.results[i].locations[0].name}</p>`);

        // appending checkbox
        let newForm = $(`<form action="#">
                    <p><label><input type="checkbox" /><span>Save this job</span></label></p></form>`)
          .attr("data-name", response.results[i].name)
          .attr("data-company", response.results[i].company.name)
          .attr("data-location", response.results[i].locations[0].name);
        newDiv.append(newForm);
      }
    });
  }

  function getCoordinates(companyName, location) {
    // coordinates ajax request
    $.ajax({
      url: `http://www.mapquestapi.com/geocoding/v1/address?key=ZnAtTuiJDu6IN6Gr7hp9MS2MkxM9hNgT&location=${companyName}${location}`,
      method: "GET",
    }).then(function (response) {
      // console.log(response);

      //get lat and lon
      lat = response.results[0].locations[0].displayLatLng.lat;
      lon = response.results[0].locations[0].displayLatLng.lng;

      // console.log(lat, lon);

      // call find bytes function with coords
      findBytes(lat, lon);
    });
  }

  // need to catch random 400 errors ??? ask teacher
  // ???????????????????????????
  function findBytes(lat, lon) {
    // restaurants ajax request
    $.ajax({
      url: `https://developers.zomato.com/api/v2.1/geocode?lat=${lat}&lon=${lon}`,
      dataType: "json",
      async: true,
      beforeSend: function (xhr) {
        xhr.setRequestHeader("user-key", "e49950936f801133968055049e30f777");
      }, // This inserts the api key into the HTTP header
      success: function (response) {
        // console.log(response);
        restaurantListings.empty();
        for (let i = 0; i < response.nearby_restaurants.length; i++) {
          let newRestaurant = $(
            `<a class="style-url right">${response.nearby_restaurants[i].restaurant.name}</a>`
          )
            // this url is taking them to the zomato website, should we send directely to food website?
            .attr("href", response.nearby_restaurants[i].restaurant.url)
            // blank target to open links in new tab
            .attr("target", "_blank");
          restaurantListings.append(newRestaurant);
          restaurantListings.append($("<br>"));
        }
      },
    });
  }

  // search for jobs button click event
  $("button.find-jobs").on("click", function () {
    const locationInputCity = jobLocationCity.val().trim();
    const locationInputState = jobLocationState.val().trim();

    // call jobs
    findJobs(locationInputCity, locationInputState);
  });

  //   target any job listing that is being clicked
  $(document).on("click", "div.jobListingClick", function () {
    // get company name
    const companyName = $(this).attr("data-name");
    // console.log(companyName);

    // get location
    const location = $(this).attr("data-location");
    // console.log(location);

    // call get coords function with name and location
    getCoordinates(companyName, location);
  });

  $(document).on("click", "form input", function () {
    // need if statement
    const form = $(this).closest("form");
    if ($(this).is(":checked")) {
      const savedJobName = form.attr("data-name");
      const savedJobCompany = form.attr("data-company");
      const savedJobLocation = form.attr("data-location");
      // get the job details (name, company, location)
      // local storage
      const savedJobObj = {
        name: savedJobName,
        company: savedJobCompany,
        location: savedJobLocation,
      };
      console.log(savedJobObj);
    } else {
      console.log("clear if out");
    }
  });
});
