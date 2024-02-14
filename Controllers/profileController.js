// Importing modules
const db = require("../Models");

// Assigning Profile to the variable Profile
const Profile = db.Profile;

// Create profile
const createProfile = async (req, res) => {
    try {
        // Get UserId from the logged-in user
        const userId = req.user.id;

        // Check if the user already has a profile
        const existingProfile = await Profile.findOne({ where: { UserId: userId } });
        if (existingProfile) {
            return res.status(400).send("User already has a profile");
        }

        // If the user doesn't have a profile, proceed with creating one
        const { designation, department, phoneNumber, country, state, city, address } = req.body;

        const profileData = {
            UserId: userId,
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
