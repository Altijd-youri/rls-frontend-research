// The dependencies
import React from "react"

// The testing methods from React Testing Librart
// See: https://testing-library.com/docs/react-testing-library/intro
import {render, fireEvent } from "@testing-library/react"

// The componenten to test. This is not always needed with Testing library.
import Home from "src/page/home/Home.js"

test("Sample Test to show that testing with Jest integrates with the pipeline.", () => {
    //Arrage

    //Act
    let resultOfAction = true

    //Assert
    expect(resultOfAction).toBe(false)
})