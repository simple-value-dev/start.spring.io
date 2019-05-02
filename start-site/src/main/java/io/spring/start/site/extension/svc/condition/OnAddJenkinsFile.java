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

package io.spring.start.site.extension.svc.condition;

import io.spring.initializr.generator.condition.ProjectGenerationCondition;
import io.spring.initializr.generator.project.ResolvedProjectDescription;

import org.springframework.context.annotation.ConditionContext;
import org.springframework.core.type.AnnotatedTypeMetadata;

/**
 * Condition that checks addJenkinsFile value in projectDescription
 *
 * {@link ProjectGenerationCondition Condition} implementation for
 * {@link ConditionalOnAddJenkinsFile}.
 *
 * @author swathi udayar
 */
class OnAddJenkinsFile extends ProjectGenerationCondition {

	@Override
	protected boolean matches(ResolvedProjectDescription projectDescription,
			ConditionContext context, AnnotatedTypeMetadata metadata) {
		if (projectDescription.getAddJenkinsFile() == null) {
			return false;
		}
		String value = (String) metadata
				.getAllAnnotationAttributes(ConditionalOnAddJenkinsFile.class.getName())
				.getFirst("value");
		return projectDescription.getAddJenkinsFile().toString().equals(value);
	}

}
