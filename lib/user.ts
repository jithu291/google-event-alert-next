import clientPromise from "./mongodb";

interface UserInput {
  name: string;
  email: string;
  image?: string;
  googleAccessToken: string;
  googleRefreshToken: string;
  tokenExpiry: number;
}

interface UpdatePhoneInput {
    email: string;
    phoneNumber: string;
  }
  

export async function upsertUser(userData: UserInput) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const now = new Date();
    
    const result = await db.collection("users").updateOne(
      { email: userData.email },
      {
        $set: {
          name: userData.name,
          image: userData.image || null,
          googleAccessToken: userData.googleAccessToken,
          googleRefreshToken: userData.googleRefreshToken,
          tokenExpiry: userData.tokenExpiry,
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true }
    );

    console.log(`User ${userData.email} ${result.upsertedCount > 0 ? 'created' : 'updated'}`);
    return result;
    
  } catch (error) {
    console.error("Error in upsertUser:", error);
    throw error;
  }
}

export async function updateUserPhone(data: UpdatePhoneInput) {
    try {
      const client = await clientPromise;
      const db = client.db();
  
      const now = new Date();
      
      const result = await db.collection("users").updateOne(
        { email: data.email },
        {
          $set: {
            phoneNumber: data.phoneNumber,
            updatedAt: now,
          },
        }
      );
  
      if (result.matchedCount === 0) {
        throw new Error("User not found");
      }
  
      console.log(`Phone number updated for user: ${data.email}`);
      return { success: true, phoneNumber: data.phoneNumber };
      
    } catch (error) {
      console.error("Error in updateUserPhone:", error);
      throw error;
    }
  }
  
  export async function getUserByEmail(email: string) {
    try {
      const client = await clientPromise;
      const db = client.db();
  
      const user = await db.collection("users").findOne({ email });
      return user;
      
    } catch (error) {
      console.error("Error in getUserByEmail:", error);
      throw error;
    }
  }

  export async function updateUserTokens(
    email: string,
    updateData: { googleAccessToken?: string; tokenExpiry?: number }
  ) {
    try {
      const client = await clientPromise;
      const db = client.db();
  
      const now = new Date();
  
      const result = await db.collection("users").updateOne(
        { email },
        {
          $set: {
            ...updateData,
            updatedAt: now,
          },
        }
      );
  
      if (!result) {
        throw new Error("User not found");
      }
  
      return { success: true };
    } catch (error) {
      console.error("Error in updateUserTokens:", error);
      throw error;
    }
  }
  