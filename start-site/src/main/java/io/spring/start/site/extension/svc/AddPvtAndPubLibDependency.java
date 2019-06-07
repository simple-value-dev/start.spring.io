/*
 * Copyright 2012-2019 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.spring.start.site.extension.svc;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;

import io.spring.initializr.generator.project.contributor.ProjectContributor;

/**
 * Contributor class to update buld.gradle and settings.gradle file to include pvt and
 * public library project in the project being generated.
 *
 * @author swathi udayar
 */
public class AddPvtAndPubLibDependency implements ProjectContributor {

	private String pvtLibProjectName;

	private String pubLibProjectName;

	AddPvtAndPubLibDependency(String pvtLibProjectName, String pubLibProjectName) {
		this.pubLibProjectName = pubLibProjectName;
		this.pvtLibProjectName = pvtLibProjectName;
	}

	@Override
	public int getOrder() {
		return 1000;
	}

	@Override
	public void contribute(Path projectRoot) throws IOException {
		// modify settings.gradle
		Path file = projectRoot.resolve("settings.gradle");
		String content = "/*//---Uncomment to include library projects dependencies---\n"
				+ "include ':" + this.pubLibProjectName + "'\n" + "project(\":"
				+ this.pubLibProjectName + "\").projectDir = file(\"../"
				+ this.pubLibProjectName + "\")\n" + "include ':" + this.pvtLibProjectName
				+ "'\n" + "project(\":" + this.pvtLibProjectName
				+ "\").projectDir = file(\"../" + this.pvtLibProjectName + "\")" + "\n*/";
		try (PrintWriter writer = new PrintWriter(
				Files.newOutputStream(file, StandardOpenOption.APPEND))) {
			writer.println(content);
		}
		// modify build.gradle
		file = projectRoot.resolve("build.gradle");
		Path tempBuildDotGradleFile = Paths.get("/tmp/temp-build.gradle");
		try (BufferedReader reader = Files
				.newBufferedReader(projectRoot.resolve("build.gradle"));
				PrintWriter writer = new PrintWriter(Files.newOutputStream(
						tempBuildDotGradleFile, StandardOpenOption.CREATE))) {
			boolean foundDependenciesBlockStart = false;
			boolean done = false;

			String line;
			String previousLine = "";
			while ((line = reader.readLine()) != null) {
				if (!done && !foundDependenciesBlockStart
						&& line.contains("dependencies {")) {
					foundDependenciesBlockStart = true;
				}
				if (!done && foundDependenciesBlockStart
						&& previousLine.contains("testImplementation")
						&& line.trim().equals("}")) {
					String strToWrite = "/*//---Uncomment to include library projects dependencies(Also uncomment from settings.gradle))---\n"
							+ "	implementation project(':" + this.pubLibProjectName
							+ "')\n" + "	implementation project(':"
							+ this.pvtLibProjectName + "')\n" + "*/\n" + "}";
					line = strToWrite;
					done = true;
				}
				if (!line.trim().equals("")) {
					previousLine = line;
				}
				writer.println(line);
			}
		}

		try (BufferedReader reader = Files.newBufferedReader(tempBuildDotGradleFile);
				PrintWriter writer = new PrintWriter(
						Files.newOutputStream(projectRoot.resolve("build.gradle")))) {
			String line;
			while ((line = reader.readLine()) != null) {
				writer.println(line);
			}
		}
		Files.delete(tempBuildDotGradleFile);
	}

}
