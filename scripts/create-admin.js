/**
 * Optional helper: creates a user account directly in MongoDB.
 * Usage: node scripts/create-admin.js "Jane Doe" jane@example.com somePassword123
 */
require("dotenv").config({ path: ".env.local" });
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

async function main() {
  const [, , name, email, password] = process.argv;
  if (!name || !email || !password) {
    console.log(
      'Usage: node scripts/create-admin.js "Jane Doe" jane@example.com somePassword123'
    );
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);

  // Defined inline (rather than importing models/User.js) because that file
  // uses ES module syntax for the Next.js app, which plain `node` can't require.
  const UserSchema = new mongoose.Schema(
    {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, unique: true, trim: true, lowercase: true },
      password: { type: String, required: true },
    },
    { timestamps: true }
  );
  const User = mongoose.models.User || mongoose.model("User", UserSchema);

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log("A user with that email already exists.");
    process.exit(1);
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  console.log(`Created user ${user.email} (${user._id})`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
