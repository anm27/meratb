import React, { useState } from "react";
import axios from "axios";
import {
  AdvancedMarker,
  Map,
  Pin,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

const SubmitDetails = () => {
  const places = useMapsLibrary("places");

  const [selectedPickup, setSelectedPickup] = useState(null);
  const [selectedDrop, setSelectedDrop] = useState(null);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [timeSlot, setTimeSlot] = useState(""); // Use as a string for both time slots and dates
  const [message, setMessage] = useState("");

  const handleSubmitDetails = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!timeSlot || !phone) {
      setMessage(
        "❗Please select a time slot or a date. Pick-up, drop location, phone number is also mandatory."
      );
      return;
    }

    try {
      console.log("Submitting travel details:", {
        pickupLocation,
        dropLocation,
        timeSlot,
        phone,
        token,
      });
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URI}/travel/submitDetails`,
        { pickupLocation, dropLocation, timeSlot, phone },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Response from server:", res.data);
      setMessage("💯Travel details submitted successfully!✔️");
    } catch (err) {
      console.error(
        "Error submitting travel details:",
        err.response ? err.response.data : err.message
      );
      setMessage("Error submitting travel details. Please try again.");
    }
  };

  const handleDateChange = (date) => {
    if (date) {
      // Format the date as a string (e.g., "yyyy-MM-dd") to ensure valid parsing
      const formattedDate = date.toISOString().split("T")[0]; // Use ISO format for consistent date handling
      setTimeSlot(formattedDate);
    }
  };

  const isDate = (str) => {
    // Check if the string is in a date format
    return !isNaN(Date.parse(str));
  };

  const PlacesAutoComplete = ({ setSelected, setLocation }) => {
    const {
      ready,
      value,
      setValue,
      suggestions: { status, data },
      clearSuggestions,
    } = usePlacesAutocomplete();

    const handleSelect = async (address) => {
      setValue(address, false);
      clearSuggestions();

      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      console.log("Lat lng: ", lat, lng);
      setSelected({ lat, lng });
      setLocation(address);
    };

    return (
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
          className="w-full p-2"
          placeholder="Enter location"
        />
        <ComboboxPopover className="z-20">
          <ComboboxList className="bg-white text-black border border-gray-300 shadow-lg">
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <ComboboxOption key={place_id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    );
  };

  const timeSlots = [
    "Want to travel right now!",
    "12:00am - 1:00am (Today)",
    "1:00am - 2:00am (Today)",
    "2:00am - 3:00am (Today)",
    "3:00am - 4:00am (Today)",
    "4:00am - 5:00am (Today)",
    "5:00am - 6:00am (Today)",
    "6:00am - 7:00am (Today)",
    "7:00am - 8:00am (Today)",
    "8:00am - 9:00am (Today)",
    "9:00am - 10:00am (Today)",
    "10:00am - 11:00am (Today)",
    "11:00am - 12:00pm (Today)",
    "12:00pm - 1:00pm (Today)",
    "1:00pm - 2:00pm (Today)",
    "2:00pm - 3:00pm (Today)",
    "3:00pm - 4:00pm (Today)",
    "4:00pm - 5:00pm (Today)",
    "5:00pm - 6:00pm (Today)",
    "6:00pm - 7:00pm (Today)",
    "7:00pm - 8:00pm (Today)",
    "8:00pm - 9:00pm (Today)",
    "9:00pm - 10:00pm (Today)",
    "10:00pm - 11:00pm (Today)",
    "11:00pm - 12:00am (Today)",
  ];

  return (
    <div className="relative max-w-md mx-auto mt-8">
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Map
          style={{ width: "100%", height: "100%" }}
          defaultZoom={13}
          defaultCenter={{ lat: 22.572645, lng: 88.363892 }}
          mapId="118fe9ff761eb2ae"
          disableDefaultUI={true}
          center={
            selectedPickup || selectedDrop || { lat: 22.572645, lng: 88.363892 }
          }
        >
          {selectedPickup && (
            <AdvancedMarker position={selectedPickup}>
              <Pin
                background={"darkcyan"}
                borderColor={"black"}
                glyphColor={"orange"}
              />
            </AdvancedMarker>
          )}
          {selectedDrop && (
            <AdvancedMarker position={selectedDrop}>
              <Pin
                background={"darkcyan"}
                borderColor={"black"}
                glyphColor={"orange"}
              />
            </AdvancedMarker>
          )}
        </Map>
      </div>

      <div className="relative z-10 bg-[#1E2D2B] p-8 shadow-lg bg-opacity-75">
        <form onSubmit={handleSubmitDetails} className="space-y-4">
          <div>
            <label
              htmlFor="pickupLocation"
              className="block text-sm font-medium text-gray-300"
            >
              Pickup Location
            </label>
            <PlacesAutoComplete
              value={pickupLocation}
              setSelected={setSelectedPickup}
              setLocation={setPickupLocation}
            />
          </div>
          <h2
            className={`text-white text-sm p-2 ${
              pickupLocation ? "bg-[#11201b]" : ""
            }`}
          >
            {pickupLocation && `Selected Pickup: ${pickupLocation}`}
          </h2>

          <div>
            <label
              htmlFor="dropLocation"
              className="block text-sm font-medium text-gray-300"
            >
              Drop Location
            </label>
            <PlacesAutoComplete
              value={dropLocation}
              setSelected={setSelectedDrop}
              setLocation={setDropLocation}
            />
          </div>
          <h2
            className={`text-white text-sm p-2 ${
              pickupLocation ? "bg-[#11201b]" : ""
            }`}
          >
            {dropLocation && `Selected Drop: ${dropLocation}`}
          </h2>

          <div className="">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-300"
            >
              Phone Number
            </label>
            <PhoneInput
              className="!w-full bg-white flex-1"
              defaultCountry="in"
              value={phone}
              onChange={(phone) => setPhone(phone)}
            />
          </div>

          <div className="!mt-10">
            <label
              htmlFor="timeSlot"
              className="block text-sm font-medium text-gray-300 mt-2"
            >
              Travel Time Slot
            </label>
            <select
              id="timeSlot"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-[#2A3F3D] border border-[#1E2D2B] rounded-md shadow-sm text-white focus:outline-none focus:ring-[#8AC9A7] focus:border-[#8AC9A7]"
            >
              <option value="">Select a time slot</option>
              {timeSlots.map((slot, index) => (
                <option key={index} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center items-center">
            <h2 className="-translate-y-2 pr-2 text-white">_____________</h2>
            <h2 className="text-white font-bold text-lg">OR</h2>
            <h2 className="-translate-y-2 pl-2 text-white">_____________</h2>
          </div>

          <div className="flex justify-center">
            <div>
              <label
                htmlFor="travelDate"
                className="block text-sm font-medium text-gray-300 "
              >
                Travel Date
              </label>
              <DatePicker
                selected={isDate(timeSlot) ? new Date(timeSlot) : null} // Check if `timeSlot` is a valid date
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select a travel date"
                className="mt-1 block w-full px-3 py-2 bg-[#2A3F3D] border border-[#1E2D2B] rounded-md shadow-sm text-white focus:outline-none focus:ring-[#8AC9A7] focus:border-[#8AC9A7]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#15683c] text-[#ffffff] font-medium rounded-md shadow-sm hover:bg-[rgb(12,77,39)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8AC9A7] shadow-white transition"
          >
            Submit Details
          </button>
        </form>

        {message && (
          <div className="mt-4 text-center">
            <p className="text-sm text-yellow-300">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmitDetails;
