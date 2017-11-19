/**
 *	ics2json Google Cloud Function
 *
 *  Copyright (c) 2017 Jan Martin Borgersen
 *
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 */

'use strict';

var cors = require("cors");

// Set the origin to the domain of your web application
var corsOptions =
{
	origin: 'http://www.example.com'
};

var ics2json_function = function (req, res)
{
	const ical = require("ical");
	const icsUrl = req.query["ics"] || "";
	const filter = req.query["filter"] || "";
	const count = req.query["count"] || 100;
	const now = (new Date()).getTime();

	// returns a sorted array of VEVENTS with startdate property in ms
	function sortEventsByDate(dataObj)
	{
		var arr = [];
		for (var k in dataObj)
		{
			if (dataObj.hasOwnProperty(k) &&
				dataObj[k].hasOwnProperty("type") &&
				dataObj[k]["type"] === "VEVENT")
			{
				arr.push({
					"key":k,
					"data":dataObj[k],
					"startdate":(new Date(dataObj[k]["start"])).getTime()
				});
			}
		}
		arr.sort(function(a,b) {
			if (a.startdate < b.startdate)
		      return -1;
		    if (a.startdate > b.startdate)
		      return 1;
		    return 0;
		});
		return arr;
	}

	if (!icsUrl)
	{
		var usageObj = {
			"name":"ics2json",
			"GET parameters":
			{
				"ics":"url to query",
				"filter":"'future', 'past'",
				"count":"number to return. default is 100."
			}
		};

		res.status(200).send(JSON.stringify({"usage":usageObj}));
	}
	else
	{
		ical.fromURL(icsUrl, {}, function(err, data)
		{
			if (err)
			{
				res.status(500).send(JSON.stringify({"error":err}));
			}
			else
			{
				var ret = {};
				var eventsArr = sortEventsByDate(data);
				var numEvents = eventsArr.length;
				var filteredEventsArr = [];

				switch(filter)
				{
					case "future":
						filteredEventsArr = eventsArr
							.filter((a) => a.startdate > now)
							.slice(0,count);
						break;
					case "past":
						filteredEventsArr = eventsArr.filter((a) => a.startdate < now);
						filteredEventsArr = filteredEventsArr.slice(filteredEventsArr.length - count, filteredEventsArr.length);
						break;
					default:
						filteredEventsArr = eventsArr.slice(0,count);
				}

				ret["data"] = filteredEventsArr;

				res.status(200).send(JSON.stringify(ret));
			}
		});
	}
};

exports.ics2json = function ics2json(req, res)
{
	var corsFn = cors(corsOptions);
	corsFn(req, res, function()
	{
		ics2json_function(req, res);
	});
}
