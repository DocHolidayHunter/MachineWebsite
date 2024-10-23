import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
import joblib  # To save and load the model

# Load the dataset
data = pd.read_csv('delay.csv')

# Drop rows with missing values in the columns of interest
data_cleaned = data.dropna(subset=['Org_Airport', 'Dest_Airport'])

# Convert times to minutes
def convert_to_minutes(time):
    try:
        hours = time // 100
        minutes = time % 100
        return hours * 60 + minutes
    except:
        return pd.NA  # Use pandas' NA for missing values

# Create new features using the conversion function
data_cleaned['DepTimeMinutes'] = data_cleaned['DepTime'].apply(convert_to_minutes)
data_cleaned['ArrTimeMinutes'] = data_cleaned['ArrTime'].apply(convert_to_minutes)
data_cleaned['CRSArrTimeMinutes'] = data_cleaned['CRSArrTime'].apply(convert_to_minutes)
data_cleaned['ArrivalDelay'] = data_cleaned['ArrTimeMinutes'] - data_cleaned['CRSArrTimeMinutes']

# Define the target variable 'Delayed'
delay_threshold = 15
data_cleaned['Delayed'] = (data_cleaned['ArrivalDelay'] > delay_threshold).astype(int)

# Define the features and target
features = ['DepTimeMinutes', 'CRSArrTimeMinutes', 'TaxiIn', 'TaxiOut', 'CarrierDelay', 
            'WeatherDelay', 'NASDelay', 'LateAircraftDelay']
X = data_cleaned[features]
y = data_cleaned['Delayed']

# Split the dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the logistic regression model
logreg = LogisticRegression(class_weight='balanced', max_iter=1000)
logreg.fit(X_train, y_train)

# Save the trained model as a .joblib file
joblib.dump(logreg, 'logistic_regression_model.joblib')

print("Model saved successfully.")
