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
import java.nio.file.StandardOpenOption;

import io.spring.initializr.generator.project.contributor.ProjectContributor;

/**
 * Contributor class to update buld.gradle to place version initialize statement before
 * applying any plugin this is needed for svc's version-management plugin which modifies
 * version based on gradle build parameter.
 *
 * @author swathi udayar
 */
public class RepositionVersionInBuildDotGradle implements ProjectContributor {

	@Override
	public int getOrder() {
		return 1001;
	}

	@Override
	public void contribute(Path projectRoot) throws IOException {
		// modify build.gradle
		try (BufferedReader reader = Files
				.newBufferedReader(projectRoot.resolve("build.gradle"));
				PrintWriter writer = new PrintWriter(
						Files.newOutputStream(projectRoot.resolve("temp-build.gradle"),
								StandardOpenOption.CREATE))) {
			boolean found = false;

			String line;
			while ((line = reader.readLine()) != null) {
				if (line.contains("version = '0.0.1-SNAPSHOT'")) {
					line = "";
				}
				if (!found && line.contains("apply plugin")) {
					line = "version = '0.0.1'\n" + line;
					found = true;
				}
				writer.println(line);
			}
		}

		try (BufferedReader reader = Files
				.newBufferedReader(projectRoot.resolve("temp-build.gradle"));
				PrintWriter writer = new PrintWriter(
						Files.newOutputStream(projectRoot.resolve("build.gradle")))) {
			String line;
			while ((line = reader.readLine()) != null) {
				writer.println(line);
			}
		}
	}

}
