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

const SubmitDetails = () => {
  const places = useMapsLibrary("places");

  const [selectedPickup, setSelectedPickup] = useState(null);
  const [selectedDrop, setSelectedDrop] = useState(null);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  // const [time, setTime] = useState('');
  const [timeSlot, setTimeSlot] = useState("Want to travel right now!");
  const [message, setMessage] = useState("");

  const handleSubmitDetails = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      console.log("Submitting travel details:", {
        pickupLocation,
        dropLocation,
        timeSlot,
        token,
      });
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URI}/travel/submitDetails`,
        { pickupLocation, dropLocation, timeSlot },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Response from server:", res.data);
      setMessage("Travel details submitted successfully!");
    } catch (err) {
      console.error(
        "Error submitting travel details:",
        err.response ? err.response.data : err.message
      );
      setMessage("Error submitting travel details. Please try again.");
    }
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
          {" "}
          {/* Add z-index here */}
          <ComboboxList className="bg-white text-black border border-gray-300 shadow-lg">
            {" "}
            {/* Style the list */}
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
    "10:00am - 11:00am",
    "11:00am - 12:00pm",
    "12:00pm - 1:00pm",
    "1:00pm - 2:00pm",
    "2:00pm - 3:00pm",
    "3:00pm - 4:00pm",
    "4:00pm - 5:00pm",
    "5:00pm - 6:00pm",
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
        {/* <h2 className="text-2xl font-bold text-[#05120d] mb-6 text-center">Submit Travel Details</h2> */}
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

          {/* <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-300">Travel Time</label>
            <input
              id="time"
              type="datetime-local"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-[#2A3F3D] border border-[#1E2D2B] rounded-md shadow-sm text-white focus:outline-none focus:ring-[#8AC9A7] focus:border-[#8AC9A7]"
            />
          </div> */}

          <div>
            <label
              htmlFor="timeSlot"
              className="block text-sm font-medium text-gray-300"
            >
              Travel Time Slot
            </label>
            <select
              id="timeSlot"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-[#2A3F3D] border border-[#1E2D2B] rounded-md shadow-sm text-white focus:outline-none focus:ring-[#8AC9A7] focus:border-[#8AC9A7]"
            >
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center text-white font-bold">
            <h2>OR</h2>
          </div>

          <div>
            <label
              htmlFor="timeSlot"
              className="block text-sm font-medium text-gray-300"
            >
              Select Date
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8AC9A7] hover:bg-[#78B694] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8AC9A7]"
            >
              Submit Details
            </button>
          </div>
        </form>
        {message && <p className="text-sm text-green-500 mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default SubmitDetails;
