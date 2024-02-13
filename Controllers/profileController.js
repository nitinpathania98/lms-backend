// Importing modules
const db = require("../Models");

// Assigning Profile to the variable Profile
const Profile = db.Profile;

// Create profile
const createProfile = async (req, res) => {
    try {
        const { userId, designation, department, phoneNumber, country, state, city, address } = req.body;

        const profileData = {
            userId, // Set userId to the ID of the corresponding user
            designation,
            department,
            phoneNumber,
            country,
            state,
            city,
            address
        };

        // Save the profile data
        const profile = await Profile.create(profileData);

        return res.status(201).send(profile);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
};

// Get all profiles
const getProfileDetails = async (req, res) => {
    try {
        const profiles = await Profile.findAll();
        return res.status(200).send(profiles);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
};

// Update profile
const updateProfile = async (req, res) => {
    try {
        const profileId = req.params.id;
        const { designation, department, phoneNumber, country, state, city, address } = req.body;
        const data = {
            designation,
            department,
            phoneNumber,
            country,
            state,
            city,
            address,
        };
        const profile = await Profile.findByPk(profileId);
        if (!profile) {
            return res.status(404).send("profile not found");
        }
        await Profile.update(data, { where: { id: profileId } });
        return res.status(200).send("profile updated successfully");
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
};

// Delete profile
const deleteProfile = async (req, res) => {
    try {
        const profileId = req.params.id;
        const profile = await Profile.findByPk(profileId);
        if (!profile) {
            return res.status(404).send("profile not found");
        }
        await Profile.destroy({ where: { id: profileId } });
        return res.status(200).send("profile deleted successfully");
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    createProfile,
    getProfileDetails,
    updateProfile,
    deleteProfile
};
