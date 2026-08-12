import java.util.Properties

plugins { id("com.android.application"); id("org.jetbrains.kotlin.android"); id("org.jetbrains.kotlin.plugin.compose") }

val local = Properties().apply {
    val file = rootProject.file("local.properties")
    if (file.exists()) file.inputStream().use(::load)
}
fun config(name: String, fallback: String = "") = (local.getProperty(name) ?: fallback).replace("\\", "\\\\").replace("\"", "\\\"")

android {
    namespace = "ec.edu.puce.matchpoint"
    compileSdk = 36
    defaultConfig {
        applicationId = "ec.edu.puce.matchpoint"
        minSdk = 26
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        buildConfigField("String", "API_BASE_URL", "\"${config("API_BASE_URL", "http://18.234.231.25:9090/")}\"")
        buildConfigField("String", "COGNITO_REGION", "\"${config("COGNITO_REGION", "us-east-1")}\"")
        buildConfigField("String", "COGNITO_USER_POOL_ID", "\"${config("COGNITO_USER_POOL_ID")}\"")
        buildConfigField("String", "COGNITO_APP_CLIENT_ID", "\"${config("COGNITO_APP_CLIENT_ID")}\"")
    }
    buildFeatures { compose = true; buildConfig = true }
    compileOptions { sourceCompatibility = JavaVersion.VERSION_17; targetCompatibility = JavaVersion.VERSION_17 }
    kotlinOptions { jvmTarget = "17" }
}

dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2024.09.00")
    implementation(composeBom)
    androidTestImplementation(composeBom)
    implementation("androidx.core:core-ktx:1.17.0")
    implementation("androidx.activity:activity-compose:1.11.0")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.9.4")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.9.4")
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.navigation:navigation-compose:2.9.5")
    implementation("com.squareup.retrofit2:retrofit:2.11.0")
    implementation("com.squareup.retrofit2:converter-gson:2.11.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.9.0")
    testImplementation("junit:junit:4.13.2")
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.9.0")
    testImplementation("com.squareup.okhttp3:mockwebserver:4.12.0")
    debugImplementation("androidx.compose.ui:ui-tooling")
}
