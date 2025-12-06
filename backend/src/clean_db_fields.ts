import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User";

dotenv.config();

const cleanUserFields = async () => {
    try {
        if (!process.env.MONGO_URL) {
            console.error("MONGO_URL missing");
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB for cleanup");

        const users = await User.find({}).lean();
        console.log(`Checking ${users.length} users...`);

        for (const user of users) {
            const u = user as any;
            let dirty = false;

            // Migrate 'enrollment no' -> 'enrollmentNumber' if main is empty
            if (u["enrollment no"] && !u.enrollmentNumber) {
                u.enrollmentNumber = u["enrollment no"];
                dirty = true;
            }

            // Migrate 'Branch' -> 'branch' if main is empty
            if (u["Branch"] && !u.branch) {
                u.branch = u["Branch"];
                dirty = true;
            }

            // Migrate 'CollegeName' -> 'collegeName' if main is empty
            if (u["CollegeName"] && !u.collegeName) {
                u.collegeName = u["CollegeName"];
                dirty = true;
            }

            // Unset old fields using $unset
            if (u["enrollment no"] || u["Branch"] || u["CollegeName"]) {
                await User.collection.updateOne(
                    { _id: user._id },
                    {
                        $unset: {
                            "enrollment no": "",
                            "Branch": "",
                            "CollegeName": ""
                        },
                        $set: {
                            enrollmentNumber: u.enrollmentNumber,
                            branch: u.branch,
                            collegeName: u.collegeName
                        }
                    }
                );
                console.log(`Cleaned user: ${user.email}`);
            }
        }

        console.log("Cleanup complete.");

    } catch (error) {
        console.error("Cleanup error:", error);
    } finally {
        await mongoose.disconnect();
    }
};

cleanUserFields();
