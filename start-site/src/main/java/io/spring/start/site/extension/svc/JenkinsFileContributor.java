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

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.function.Predicate;

import io.spring.initializr.generator.project.contributor.ProjectContributor;

import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.util.FileCopyUtils;

/**
 * Contributor class to add jenkins file in the project being generated.
 *
 * @author swathi udayar
 */
public class JenkinsFileContributor implements ProjectContributor {

	private final PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();

	private final String rootResource; // path of parent folder where template jenkinsfile
										// resides

	public JenkinsFileContributor(String rootResource) {
		this.rootResource = rootResource;
	}

	@Override
	public void contribute(Path projectRoot) throws IOException {
		// get resource descriptor for rootResource (parent folder where template
		// jenkinsfile resides)
		Resource root = this.resolver.getResource(this.rootResource);
		// get resource descriptor for Jenkinsfile in rootResource
		Resource templateJenkinsfile = this.resolver
				.getResource(this.rootResource + "/Jenkinsfile");
		Predicate<String> executable = (filename) -> false;
		// get file name from resource uri
		String filename = templateJenkinsfile.getURI().toString()
				.substring(root.getURI().toString().length() + 1);
		// check if template jenkinsfile is readable
		if (templateJenkinsfile.isReadable()) {
			// Convert given filename string to a path and resolves it against projectRoot
			Path output = projectRoot.resolve(filename);
			// Create all directories by creating all nonexistent parent directories
			// first.
			Files.createDirectories(output.getParent());
			// create jenkinsfile
			Files.createFile(output);
			// copy contents of templateJenkinsfile to jenkinsfile of project
			FileCopyUtils.copy(templateJenkinsfile.getInputStream(),
					Files.newOutputStream(output));
			output.toFile().setExecutable(executable.test(filename));
		}
	}

}
