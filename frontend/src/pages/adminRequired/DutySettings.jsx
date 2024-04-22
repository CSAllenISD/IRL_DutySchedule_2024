import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { addDays } from "date-fns";

import AdminNavbar from "../../components/AdminNavbar";

import { DateRangePicker } from "react-date-range";

function DutySettings() {
    const [dutySettings, setDutySettings] = useState({
        rotations: 1,
        rotationDates: [],
    });

    const [selectedRotationDate, setSelectedRotationDate] = useState(-1);
    const [lastChangedSelected, setLastChangedSelected] = useState(new Date());

    const saveSettings = () => {
        fetch("./adminPanel/updateDutySettings", {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            method: "PATCH",
            body: JSON.stringify(dutySettings),
        });
    };

    function loadCurrentData() {
        // setDutySettings({});
        fetch("./adminPanel/dutySettings")
            .then((response) => response.json())
            .then((json) => {
                // setDutySettings(json);
            });
    }

    useEffect(() => {
        loadCurrentData();
    }, []);

    const updateSettings = (event) => {
        let fieldName = event.target.name;
        let fieldVal = event.target.value;
        setDutySettings({
            ...dutySettings,
            [fieldName]: fieldVal,
        });
    };

    const handleRotationDateApply = (i, ranges) => {
        const oldRotationDates = dutySettings.rotationDates;
        oldRotationDates[i] = ranges;

        console.log(ranges);
        setDutySettings({
            ...dutySettings,
            rotationDates: oldRotationDates,
        });
    };

    const selectRange = (e) => {
        // if (!e && new Date().getTime() - 100 > lastChangedSelected.getTime()) {
        //     setSelectedRotationDate(-1);
        //     return
        // }

        try {
            const i = e.target.closest(".picker").className.toString().split(" ").find(a => a.startsWith("picker-")).replace("picker-", "");
            setSelectedRotationDate(parseInt(i));
            setLastChangedSelected(new Date());
        } catch (err) {}
    };

    const createRotationDateSelectors = (n) => {
        const elements = [];
        if (!dutySettings?.rotationDates) dutySettings.rotationDates = [];

        for (let i = 0; i < n; i++) {
            if (dutySettings.rotationDates.length <= i)
                dutySettings.rotationDates.push([
                    {
                        startDate: new Date(),
                        endDate: addDays(new Date(), 7),
                        key: "selection",
                    },
                ]);

            elements.push(
                <div onClick={selectRange} onBlur={() => selectRange()}>
                    <DateRangePicker
                        className={`picker ${selectedRotationDate === i ? "" : "not-selected"} picker-${i}`}
                        renderStaticRangeLabel={null}
                        key={i}
                        onChange={(item) =>
                            handleRotationDateApply(i, [item.selection])
                        }
                        showSelectionPreview={true}
                        months={2}
                        ranges={dutySettings.rotationDates[i]}
                        direction="horizontal"
                    />
                </div>
            );
        }

        return elements;
    };

    return (
        <main
            className="fullPage w-100"
            style={{ backgroundColor: "hsl(0, 0%, 96%)" }}
        >
            <AdminNavbar selected="dutySettings" />
            <section className="d-flex align-items-center">
                <div className="w-100 px-4 py-5 px-md-5 text-center text-lg-start">
                    <h1 className="mb-5">Duty Settings</h1>
                    <Form className="fs-4">
                        <Form.Group
                            className="mb-3 d-flex flex-row justify-content-between"
                            controlId="formShifts"
                        >
                            <Form.Label>
                                Number of Shifts Teachers Need to Have:
                            </Form.Label>
                            <Form.Control
                                name="shifts"
                                className="w-50"
                                type="number"
                                placeholder="6"
                                value={dutySettings?.shifts}
                                onChange={updateSettings}
                            />
                        </Form.Group>

                        <Form.Group
                            className="mb-5 d-flex flex-row justify-content-between"
                            controlId="formRotations"
                        >
                            <Form.Label>
                                Number of Rotations this Year:
                            </Form.Label>
                            <Form.Control
                                name="rotations"
                                className="w-50"
                                type="number"
                                placeholder="6"
                                value={dutySettings?.rotations}
                                onChange={updateSettings}
                            />
                        </Form.Group>
                        <Form.Group className="mb-5" controlId="formResponses">
                            <Form.Label>Select Rotation Dates:</Form.Label>
                            <br />
                            {createRotationDateSelectors(
                                dutySettings?.rotations
                            )}
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </div>
            </section>
        </main>
    );
}

export default DutySettings;
